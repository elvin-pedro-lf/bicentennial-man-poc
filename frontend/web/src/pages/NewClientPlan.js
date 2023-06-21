import React from "react";
import { useSelector } from "react-redux";
import ClientPlan from "../components/Client/Client.Plan";

const NewClientPlan = (props) => {
  const chatGPTState = useSelector(
    (__state__) => __state__.getBlockOfWorkoutFromChatGPT
  );

  return <ClientPlan changePlan={props.changePlan} dataState={chatGPTState} />;
};

export default NewClientPlan;
