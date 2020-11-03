// Enter your own Cotter api keys and Cloudflare subdomain here
export const COTTER_API_KEY_ID = "<YOUR COTTER API KEY ID>";
export const CLOUDFLARE_WORKER_DOMAIN = "YOURSUBDOMAIN.workers.dev";

// Why is this hard coded?
// On a Single Page App, there's not much way to keep your variables a secret.
// the API KEY ID is designed to be `okay` when revealed publicly. Of course,
// if you can keep it a secret, that'll be better.

// How to protect your API KEY ID:
// Update your Settings > Allowed URLs in Cotter's Dashboard to only allow
// your website to use your API KEY ID.
