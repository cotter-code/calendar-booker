import { Link } from "@reach/router";
import axios from "axios";
import { CotterContext, withAuthenticationRequired } from "cotter-react"; // 👈  Import the user context
import React, { useContext, useEffect, useState } from "react";
import { CLOUDFLARE_WORKER_DOMAIN } from "../../constants";
import copyToClipboard from "../../utils/copyToClipboard";
import "./styles.css";

function DashboardPage() {
  const { user, getAccessToken, getCotter, isLoggedIn } = useContext(
    CotterContext
  ); // Get the logged-in user information
  const [connected, setconnected] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.ID) {
      checkConnection();
    }
  }, [isLoggedIn, user]);

  // Check if the user has connected their Google Account
  const checkConnection = async () => {
    // Get the logged-in user's Cotter Access Token to access our API endpoints
    const accessToken = await getAccessToken();
    try {
      const resp = await axios.get(
        `https://checkconnection.${CLOUDFLARE_WORKER_DOMAIN}?user_id=${user?.ID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken?.token}`,
          },
        }
      );
      setconnected(resp?.data.connected);
    } catch (e) {
      setconnected(false);
    }
  };

  // Disconnect the user's Google Account
  const disconnect = async () => {
    // Get the logged-in user's Cotter Access Token to access our API endpoints
    const accessToken = await getAccessToken();
    const resp = await axios.get(
      `https://disconnect.${CLOUDFLARE_WORKER_DOMAIN}?user_id=${user?.ID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken?.token}`,
        },
      }
    );
    checkConnection();
  };

  // If the user hasn't connected their Google Account,
  // show a button to call this function to connect
  const connectToGoogle = async () => {
    // Get the logged-in user's Cotter Access Token to access our API endpoints
    const accessToken = await getAccessToken();
    const cotter = getCotter();
    cotter.connectSocialLogin("GOOGLE", accessToken?.token); // pass in the provider's name
  };

  const copyLink = (duration) => {
    copyToClipboard(
      `${window.location.origin}/${user?.identifier}/${duration}`
    );
  };
  return (
    <div className="DashboardPage__container">
      <div className="DashboardPage__header-container">
        <div className="DashboardPage__header">
          <div className="DashboardPage__avatar" />
          <div className="DashboardPage__label-container">
            <div className="DashboardPage__title">{user?.identifier}</div>
            <div className="DashboardPage__label">Google Connection</div>
            {connected ? (
              <div className="DashboardPage__subtitle has-text-success">
                Connected
              </div>
            ) : (
              <div className="DashboardPage__subtitle has-text-danger">
                Not Connected
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="DashboardPage__body-container">
        <div className="DashboardPage__section">
          <div className="DashboardPage__label">
            Your Google Account is {connected ? "connected" : "not connected"}
          </div>
          {connected ? (
            <div
              className="button is-danger DashboardPage__button"
              onClick={disconnect}
            >
              Disconnect Google Account
            </div>
          ) : (
            <div
              className="button DashboardPage__button"
              onClick={connectToGoogle}
            >
              Connect Google Account
            </div>
          )}
        </div>
        {connected ? (
          <div className="DashboardPage__section">
            <div className="title is-5">Your Link</div>
            <div>
              <code className="has-text-primary">
                {window.location.origin}/{user?.identifier}
              </code>
            </div>
          </div>
        ) : (
          <div className="subtitle">
            You have to connect your Google Account before others can book a
            slot in your Google Calendar
          </div>
        )}

        {connected && (
          <div className="DashboardPage__section columns">
            {[15, 30, 60].map((durationOption) => (
              <div className="column">
                <div className="DashboardPage__share-calendar box container">
                  <div className="title is-4">
                    {durationOption} Minute Slots
                  </div>
                  <div>
                    <Link to={`/${user?.identifier}/${durationOption}`}>
                      <code className="has-text-primary">
                        /{durationOption}
                      </code>
                    </Link>
                  </div>
                  <div
                    className="button is-small mt-4"
                    onClick={() => copyLink(durationOption)}
                  >
                    Copy Link
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Protect this page using the `withAuthenticationRequired` HOC
// If user is not logged-in, they'll be redirected to the `loginPagePath`
export default withAuthenticationRequired(DashboardPage, {
  loginPagePath: "/",
});
