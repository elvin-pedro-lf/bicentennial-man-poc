import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import Button from "react-bootstrap/Button";

import ActionRejected from "../ActionRejected";
import PageLoader from "../PageLoader";
import WorkoutGrid from "../Workout/Workout.Grid";

import {
  getBlockOfWorkoutFromChatGPTAction,
  storePlanFromChatGPTAction,
} from "../../redux/slice/newClientSlice";
import { NewClientContent } from "../../content/NewClientContent";

import parse from "html-react-parser";

const ClientPlan = ({ changePlan, dataState, plan: dataKey = "response" }) => {
  const dispatch = useDispatch();
  const inputAdjustmentsRef = useRef();
  const [makeAdjustments, setMakeAdjustments] = useState(changePlan || false);
  const chatGPTState = dataState;
  let blockOfWorkout = null;
  if (!chatGPTState || !chatGPTState[dataKey]) {
    window.location.href = "/";
  } else if (chatGPTState.fulfilled) {
    if (chatGPTState.makeAdjustments) {
      blockOfWorkout = chatGPTState[dataKey];
    } else {
      blockOfWorkout = JSON.parse(chatGPTState[dataKey]);
    }
  }

  const getPayload = (
    displayPrompt,
    prompt,
    validate = false,
    _makeAdjustments_ = false
  ) => {
    //let history = [...chatGPTState.history];
    let history = [
      {
        role: "user",
        content: `${
          NewClientContent.ChatGPTAPIPromptStart
        }\n${NewClientContent.ChatGPTAPIPromptClosing(
          chatGPTState.selectedProfileAndPreferences.programLengthInWeeks
        )}`,
      },
    ];
    if (_makeAdjustments_) {
      history.push(chatGPTState.history[chatGPTState.history.length - 1]);
    } else {
      const history_length = chatGPTState.history.length;
      for (let i = history_length - 3; i < history_length; i++) {
        history.push(chatGPTState.history[i]);
      }
    }
    console.log(
      "***** getPayload.selectedProfileAndPreferences: ",
      chatGPTState.selectedProfileAndPreferences
    );
    return {
      history,
      totalTokens: chatGPTState.total_tokens,
      displayPrompt,
      prompt,
      validate,
      makeAdjustments: _makeAdjustments_,
      selectedProfileAndPreferences: {
        clientAge: chatGPTState.selectedProfileAndPreferences.clientAge,
        clientSexAtBirth:
          chatGPTState.selectedProfileAndPreferences.clientSexAtBirth,
        programLengthInWeeks:
          chatGPTState.selectedProfileAndPreferences.programLengthInWeeks,
      },
    };
  };
  const adjustYourPlanHandler = () => {
    clearLocalStorage();
    dispatch(
      getBlockOfWorkoutFromChatGPTAction(
        getPayload(
          NewClientContent.ChatGPTAPIAdjustYourPlanDisplayPrompt,
          NewClientContent.ChatGPTAPIAdjustYourPlanPrompt
        )
      )
    );
  };

  const makeAdjustmentsHandler = () => {
    if (inputAdjustmentsRef.current.value.trim().length) {
      setMakeAdjustments(false);
      dispatch(
        getBlockOfWorkoutFromChatGPTAction(
          getPayload(
            inputAdjustmentsRef.current.value,
            `${inputAdjustmentsRef.current.value}\n${NewClientContent.ChatGPTAPIAdjustmentRequestFormat}`,
            true,
            true
          )
        )
      );
    } else {
      alert("Please enter any adjustments you'd like to make to your plan.");
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("MY_WORKOUT_LOADED");
    localStorage.removeItem("MY_WORKOUT_DATA");
    localStorage.removeItem("MY_WORKOUT_EXPIRATION");

    localStorage.removeItem("MY_HISTORY_LOADED");
    localStorage.removeItem("MY_HISTORY_DATA");
    localStorage.removeItem("MY_HISTORY_EXPIRATION");
  };

  const acceptYourPlanHandler = () => {
    clearLocalStorage();
    dispatch(
      storePlanFromChatGPTAction({
        history: chatGPTState.history,
        workout: blockOfWorkout,
        selectedProfileAndPreferences:
          chatGPTState.selectedProfileAndPreferences,
      })
    );
  };

  return (
    <div id="new-client">
      {chatGPTState.pending && (
        <>
          <PageLoader message="Your request has been submitted." />
          <div className="display-prompt">{parse(chatGPTState.prompt)}</div>
        </>
      )}

      {chatGPTState.fulfilled &&
        !chatGPTState.pending &&
        (chatGPTState.accepted || blockOfWorkout) && (
          <>
            <div id="new-client-plan">
              {!chatGPTState.makeAdjustments && (
                <WorkoutGrid
                  workout={blockOfWorkout}
                  exclude={["Completed", "sortIndex"]}
                />
              )}
              {chatGPTState.makeAdjustments && (
                <div id="adjust-plan">
                  {chatGPTState.prompt.toUpperCase()}
                  <br />
                  <br />
                  {parse(blockOfWorkout)}
                </div>
              )}
            </div>

            {!makeAdjustments &&
              !chatGPTState.accepted &&
              !chatGPTState.makeAdjustments && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setMakeAdjustments(true)}
                  >
                    MAKE ADJUSTMENTS
                  </Button>
                </>
              )}

            {!chatGPTState.accepted &&
              !makeAdjustments &&
              !chatGPTState.makeAdjustments && (
                <Button onClick={acceptYourPlanHandler}>
                  ACCEPT YOUR PLAN
                </Button>
              )}
            {!chatGPTState.accepted &&
              !makeAdjustments &&
              chatGPTState.makeAdjustments && (
                <Button onClick={adjustYourPlanHandler}>
                  ADJUST YOUR PLAN
                </Button>
              )}

            {makeAdjustments && !chatGPTState.accepted && (
              <div id="makeAdjustments">
                <strong>What Adjustments Would You Like To Make?</strong>
                <textarea ref={inputAdjustmentsRef}></textarea>
                <Button
                  variant="secondary"
                  onClick={() => setMakeAdjustments(false)}
                >
                  CANCEL ADJUSTMENTS
                </Button>
                <Button onClick={makeAdjustmentsHandler}>CONTINUE</Button>
              </div>
            )}
          </>
        )}

      {chatGPTState.rejected && <ActionRejected message={chatGPTState.error} />}
    </div>
  );
};

export default ClientPlan;
