import { Link } from "@reach/router";
import { CotterContext } from "cotter-react";
import React, { useContext } from "react";
import { useState } from "react";
import "./styles.css";

function Navbar() {
  const { isLoggedIn, logout } = useContext(CotterContext); // Check if the user is logged-in, and get the logout function
  const [menuopen, setmenuopen] = useState(false);

  const onLogOut = async () => {
    await logout(); // Call the logout function to log out
    window.location.href = "/"; // then redirect to the home page
  };

  const toggleMenu = () => {
    setmenuopen((o) => !o);
  };
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="/cottercalendar200.png" width="30" height="30" alt="Logo" />
        </a>

        <div
          role="button"
          className={`navbar-burger burger ${menuopen && "is-active"}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={toggleMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </div>
      </div>

      <div
        id="navbarBasicExample"
        className={`navbar-menu ${menuopen && "is-active"}`}
      >
        <div className="navbar-end">
          <div className="navbar-item Navbar__item">
            <Link to="/">Home</Link>
          </div>

          <div className="navbar-item Navbar__item">
            <Link to="/dashboard">Dashboard</Link>
          </div>
          {isLoggedIn ? ( // Show the logout button if the user is logged-in
            <div className="navbar-item Navbar__item">
              <div
                className="button is-black Navbar__button"
                onClick={onLogOut}
              >
                Log Out
              </div>
            </div>
          ) : (
            // Otherwise, show the login button
            <div className="navbar-item Navbar__item">
              <div className="button is-black Navbar__button">
                <Link to="/">Log In</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
