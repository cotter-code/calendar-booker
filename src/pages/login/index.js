import { LoginForm } from "cotter-react";
import React from "react";
import { navigate } from "@reach/router"; // 👈  Import the navigate function
import "./styles.css";

function LoginPage() {
  return (
    <div className="LoginPage__container">
      <div className="LoginPage__title">
        Welcome to Cotter's Calendar Booker
      </div>
      <div className="LoginPage__form-container">
        <LoginForm
          onSuccess={() => navigate("/dashboard")} // 👈  Navigate on success
          onError={(err) => console.log(err)}
        />
      </div>
    </div>
  );
}

export default LoginPage;
