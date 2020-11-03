import { Link } from "@reach/router";
import { CotterContext } from "cotter-react";
import React, { useContext } from "react";
import "./styles.css";

function Navbar() {
  const { isLoggedIn, logout } = useContext(CotterContext); // Check if the user is logged-in, and get the logout function

  const onLogOut = async () => {
    await logout(); // Call the logout function to log out
    window.location.href = "/"; // then redirect to the home page
  };
  return (
    <div className="Navbar__container">
      <div className="Navbar__item">
        <Link to="/">Home</Link>
      </div>
      <div className="Navbar__item">
        <Link to="/dashboard">Dashboard</Link>
      </div>
      {isLoggedIn ? ( // Show the logout button if the user is logged-in
        <div className="Navbar__item">
          <div className="Navbar__button" onClick={onLogOut}>
            Log Out
          </div>
        </div>
      ) : (
        // Otherwise, show the login button
        <div className="Navbar__item">
          <div className="Navbar__button">
            <Link to="/">Log In</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
