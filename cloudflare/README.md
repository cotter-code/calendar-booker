# Cloudflare API Endpoints

This folder contains the code that you need to add into your cloudflare workers to create 3 API endpoints:
- `checkconnection.YOURSUBDOMAIN.workers.dev` to check if the user has connected their Google Account
- `createevent.YOURSUBDOMAIN.workers.dev` to create an calendar event in the user's Google Calendar
- `disconnect.YOURSUBDOMAIN.workers.dev` to disconnect the user's Google Account

### Usage
Create a new Worker at Cloudflare, and set the subdomains of the endpoints according to the above.
- Copy the contents of `checkconnection.js` into `checkconnection.YOURSUBDOMAIN.workers.dev`
- Copy the contents of `createevent.js` into `createevent.YOURSUBDOMAIN.workers.dev`
- Copy the contents of `disconnect.js` into `disconnect.YOURSUBDOMAIN.workers.dev`

### Required environment variables:

**`checkconnection`**:
- `API_KEY_ID`: Cotter project's API Key ID
- `API_SECRET_KEY`: Cotter project's API Key ID

**`createevent`**:
- `API_KEY_ID`: Cotter project's API Key ID
- `API_SECRET_KEY`: Cotter project's API Key ID
- `GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID that you used for the Google Sign In
- `GOOGLE_CLIENT_SECRET`: Google OAuth 2.0 Client Secret that you used for the Google Sign In

**`disconnect`**:
- `API_KEY_ID`: Cotter project's API Key ID
- `API_SECRET_KEY`: Cotter project's API Key ID

