import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/img/default-profile.png";
import "../App.css";
import Button from "react-bootstrap/Button";

const Welcome = () => {
  const navigate = useNavigate();

  const termsAndConditionsHandler = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div id="Home">
      <p className="home-text">
        Welcome to Coach Drew. We are Beta testing how natural language models
        can be used to create workout plans, provide motivation and help you
        achieve your fitness goals. I agree to the terms and conditions and be
        sent an activation code. **{" "}
      </p>
      <header className="App-header">
        <img src={logo} alt="Coach Drew" />
      </header>
      <div id="termsAndConditions">
        <a
          href="https://www.lifefitness.com/en-us/legal/terms-conditions"
          target="_termsAndCondiions"
        >
          TERMS AND CONDITIONS
        </a>
      </div>
      <Button onClick={termsAndConditionsHandler}>
        AGREE TO TERMS AND CONDITIONS
      </Button>
    </div>
  );
};

export default Welcome;
