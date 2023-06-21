import React, { useEffect } from "react";

import logo from "../assets/img/default-profile.png";
import "../App.css";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import ActionRejected from "../components/ActionRejected";

import { useNavigate } from "react-router-dom";
import { getBlockOfWorkoutFromChatGPTAction } from "../redux/slice/newClientSlice";

const Home = () => {
  const dispatch = useDispatch();
  const chatGPTState = useSelector(
    (__state__) => __state__.getBlockOfWorkoutFromChatGPT
  );

  useEffect(() => {
    dispatch(getBlockOfWorkoutFromChatGPTAction({ source: "firestore" }));
  }, [dispatch]);

  const navigate = useNavigate();

  const missedMyWorkoutHandler = (e) => {
    e.preventDefault();
    alert("I missed my workout - Coming Soon!");
  };
  const changeMyPlanHandler = (e) => {
    e.preventDefault();
    navigate("/client/change/plan");
  };

  const newClientHandler = (e) => {
    e.preventDefault();
    window.location.href = "/client/new";
  };

  const isJSONEmpty = (jsonData) => {
    return !jsonData || Object.keys(JSON.parse(jsonData)).length === 0;
  };

  return (
    <div id="Home">
      {chatGPTState.fulfilled && !isJSONEmpty(chatGPTState.response) && (
        <>
          <p className="home-text">What can I help you with today?</p>
          <header className="App-header small">
            <img src={logo} alt="Coach Drew" />
          </header>
          <Button variant="secondary" onClick={missedMyWorkoutHandler}>
            I Missed My Workout
          </Button>
          <br />
          <Button variant="secondary" onClick={changeMyPlanHandler}>
            I Want To Change My Plan
          </Button>
          <br />
          <Button variant="secondary" onClick={newClientHandler}>
            Try Something New
          </Button>
        </>
      )}
      {chatGPTState.fulfilled && isJSONEmpty(chatGPTState.response) && (
        <>
          <p className="home-text">
            I understand you are looking for help achieving your fitness goals.
            I can help. I just need a few items of information and I can provide
            you a custom plan, track your results and make adjustments as we go.
          </p>
          <header className="App-header">
            <img src={logo} alt="Coach Drew" />
          </header>
          <Button onClick={newClientHandler}>LET'S BEGIN</Button>
        </>
      )}

      {chatGPTState.rejected && <ActionRejected message={chatGPTState.error} />}
    </div>
  );
};

export default Home;
