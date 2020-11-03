// ======================================================
// Disconnect the user's Google Account
// ======================================================

// REQUIREMENTS:
// - API_KEY_ID and API_SECRET_KEY env variables using Cotter API keys

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
  // 1️⃣ Check if the access token is valid
  try {
    const valid = await checkJWT(request, API_KEY_ID);
    if (!valid) throw new Error("Access token is invalid");
  } catch (e) {
    return new Response(e.message, {
      status: 401,
    });
  }

  // 2️⃣ Call Cotter's API to see if the user has connected Google
  // get the Cotter User ID from the query parameter
  const { searchParams } = new URL(request.url);
  let userID = searchParams.get("user_id");
  const config = {
    method: "DELETE",
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
  } catch (e) {
    console.log(e);
    const body = JSON.stringify({ success: false });
    return new Response(body, {
      status: 500,
    });
  }

  const body = JSON.stringify({ success: true });
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
// Validating the JWT Token
// ======================================================

// USAGE
// const resp = await validateJWT(access_token, apiKeyID)
//
// resp = { valid: true }
// or
// resp = { valid: false, reason: "error message" }

const CotterBaseURL = "https://www.cotter.app/api/v0";
const CotterJWTKID = "SPACE_JWT_PUBLIC:8028AAA3-EC2D-4BAA-BE7A-7C8359CCB9F9";
const jwksPath = "/token/jwks";
const COTTER_DOMAIN = "https://www.cotter.app";

let cacheKeys = undefined;
const getPublicKeys = async (cotterBaseURL) => {
  if (!cacheKeys) {
    const url = `${cotterBaseURL}${jwksPath}`;
    const resp = await fetch(url);
    const r = await resp.json();
    const newKeys = r.keys.reduce((agg, current) => {
      agg[current.kid] = current;
      return agg;
    }, {});
    cacheKeys = newKeys;
    return newKeys;
  } else {
    return cacheKeys;
  }
};
const decodeJWTPayload = function (token) {
  var output = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  const result = atob(output);

  try {
    return JSON.parse(decodeURIComponent(escape(result)));
  } catch (err) {
    console.log(err);
    return JSON.parse(result);
  }
};

function decodeJWT(token) {
  const parts = token.split(".");
  const header = JSON.parse(atob(parts[0]));
  const payload = decodeJWTPayload(token);
  const signature = atob(parts[2].replace(/_/g, "/").replace(/-/g, "+"));
  return {
    header: header,
    payload: payload,
    signature: signature,
    raw: { header: parts[0], payload: parts[1], signature: parts[2] },
  };
}

const validateJWTPayload = (token, apiKeyID) => {
  try {
    const dateInSecs = (d) => Math.ceil(Number(d) / 1000);
    const date = new Date();
    let iss = token.iss;
    iss = iss.endsWith("/") ? iss.slice(0, -1) : iss;

    if (iss !== COTTER_DOMAIN) {
      throw new Error(
        `Token iss value (${iss}) doesn't match COTTER_DOMAIN (${COTTER_DOMAIN})`
      );
    }

    if (apiKeyID && apiKeyID.length > 0 && token.aud !== apiKeyID) {
      throw new Error(
        `Token aud value (${token.aud}) doesn't match API_KEY_ID`
      );
    }

    if (token.exp < dateInSecs(date)) {
      throw new Error(`Token exp value is before current time`);
    }
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

const validateJWTSignature = async (token) => {
  const encoder = new TextEncoder();
  const data = encoder.encode([token.raw.header, token.raw.payload].join("."));
  const signature = new Uint8Array(
    Array.from(token.signature).map((c) => c.charCodeAt(0))
  );
  const jwtKeys = await getPublicKeys(CotterBaseURL);
  const jwk = jwtKeys[CotterJWTKID];
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"]
  );
  return crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    signature,
    data
  );
};

const validateJWT = async (tokenStr, apiKey) => {
  const tokenRaw = decodeJWT(tokenStr);
  try {
    const validSignature = await validateJWTSignature(tokenRaw);
    if (!validSignature) throw new Error("Invalid JWT Signature");
    const validToken = validateJWTPayload(tokenRaw.payload, apiKey);
    if (!validToken) throw new Error("Invalid JWT token");
    return { valid: true };
  } catch (e) {
    return { valid: false, reason: e.toString() };
  }
};

async function checkJWT(request, API_KEY_ID) {
  // 1) Check if the authorization header exists
  const auth = request.headers.get("Authorization");
  if (!auth) throw new Error("Authorization header missing");
  const bearer = auth ? auth.split(" ") : [];
  const token = bearer && bearer.length > 0 ? bearer[1] : null;

  // 2) Check if the access token is valid
  const resp = await validateJWT(token, API_KEY_ID);
  return resp.valid;
}
