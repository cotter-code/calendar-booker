// ======================================================
// Create a Calendar Event on the user's Google Calendar
// ======================================================

// REQUIREMENTS:
// - API_KEY_ID and API_SECRET_KEY env variables using Cotter API keys
// - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env variables using Google OAuth 2.0 Credentials

async function handleWithCorsHeader(request) {
  const resp = await handleRequest(request);
  resp.headers.set("Access-Control-Allow-Origin", "*");
  return resp;
}

addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method === "OPTIONS") {
    event.respondWith(handleOptions(request));
  } else {
    event.respondWith(handleWithCorsHeader(request));
  }
});

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  //1️⃣ Call Cotter's API to see if the user has connected Google
  // get the Cotter User ID from the query parameter
  const { searchParams } = new URL(request.url);
  let userID = searchParams.get("user_id");
  let googleTokens;
  const config = {
    headers: {
      "Content-Type": "application/json",
      API_KEY_ID: API_KEY_ID,
      API_SECRET_KEY: API_SECRET_KEY,
    },
  };
  try {
    const response = await fetch(
      `https://www.cotter.app/api/v0/oauth/token/GOOGLE/${userID}`,
      config
    );
    if (response.status != 200) throw new Error("Token doesn't exist");
    const resp = await response.json();
    googleTokens = resp.tokens;
  } catch (e) {
    console.log(e);
    const body = JSON.stringify({
      success: false,
      error: "Google Account is not connected properly",
    });
    return new Response(body, {
      status: 500,
    });
  }

  // 2️⃣ Call Google Event Insert API
  const req = await request.json();
  const eventRequest = {
    start: { dateTime: req.start_time },
    end: { dateTime: req.end_time },
    attendees: [{ email: req.attendee_email }],
    summary: req.meeting_title,
  };
  const eventConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${googleTokens.access_token}`,
    },
    body: JSON.stringify(eventRequest),
  };
  let eventResponse;

  try {
    let eventResp = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
      eventConfig
    );

    // If unauthorized, try refreshing the access token
    if (eventResp.status === 401) {
      googleTokens = await refreshGoogleToken(googleTokens.refresh_token);
      // Then calling the API again
      eventConfig.headers.Authorization = `Bearer ${googleTokens.access_token}`;
      eventResp = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
        eventConfig
      );
    }

    eventResponse = await eventResp.json();
    if (eventResp.status != 200)
      throw new Error("Fail calling Google's Event API");
  } catch (e) {
    console.log(e);
    const body = JSON.stringify({
      success: false,
      error: "Fail calling Google's event insert API",
    });
    return new Response(body, {
      status: 500,
    });
  }

  const body = JSON.stringify({ success: true, event: eventResponse });
  return new Response(body, { status: 200 });
}

// ======================================================
//                  HELPER FUNCTIONS
// ======================================================

// ======================================================
// Handle Options to pass CORS
// ======================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, API_KEY_ID, Authorization",
  "Access-Control-Max-Age": "86400",
};
function handleOptions(request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check the requested method + headers
    // you can do that here.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, PUT, OPTIONS",
      },
    });
  }
}

// ======================================================
// Refresh Google's Access Token when Expired
// ======================================================
// Access tokens from Google can expire, use this function to refresh the access token
// the `refresh_token` can be retrieved from Cotter's API

// REQUIREMENTS:
// - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env variables using Google OAuth 2.0 Credentials

async function refreshGoogleToken(refresh_token) {
  const body = {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: refresh_token,
    grant_type: "refresh_token",
  };
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(`https://oauth2.googleapis.com/token`, config);
  const resp = await response.json();
  console.log(resp);
  if (response.status !== 200) throw new Error("Fail refreshing token");
  return resp;
}
