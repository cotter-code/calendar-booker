import React from "react";
import { Router } from "@reach/router";
import LoginPage from "../login";
import DashboardPage from "../dashboard";
import BookingPage from "../book";
import { CotterProvider } from "cotter-react";
import { COTTER_API_KEY_ID } from "../../constants";
import Navbar from "../../components/Navbar";

function App() {
  return (
    <CotterProvider apiKeyID={COTTER_API_KEY_ID}>
      <Navbar /> {/* 👈  Add the Navbar component */}
      <Router>
        <LoginPage path="/" />
        <DashboardPage path="/dashboard" />
        <BookingPage path="/:identifier/:duration" />
      </Router>
    </CotterProvider>
  );
}

export default App;
