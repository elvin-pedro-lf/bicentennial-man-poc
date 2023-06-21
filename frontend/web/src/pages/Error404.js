import React from "react";

import logo from "../assets/img/default-profile.png";
import "../App.css";
import "../assets/css/default.scss";
import Button from "react-bootstrap/Button";

const Error404 = () => {
  const homeHandler = () => {
    window.location.href = "/";
  };

  return (
    <div className="App">
      <div id="Home" style={{ textAlign: "center" }}>
        <h1 style={{ textAlign: "center", marginTop: "20px" }}>
          Page Not Found
        </h1>
        <p>The page you're trying to reach does not exist.</p>
        <header className="App-header">
          <img src={logo} alt="Coach Drew" />
        </header>
        <Button onClick={homeHandler}>BACK TO HOME</Button>
      </div>
    </div>
  );
};

export default Error404;
