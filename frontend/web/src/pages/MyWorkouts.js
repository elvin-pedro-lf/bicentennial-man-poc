import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionRejected from "../components/ActionRejected";
import PageLoader from "../components/PageLoader";
import WorkoutGrid from "../components/Workout/Workout.Grid";
import { getMyWorkoutsAction } from "../redux/slice/workoutsSlice";

const MyWorkouts = () => {
  const dispatch = useDispatch();
  const chatGPTState = useSelector(
    (__state__) => __state__.workoutsFromChatGPT
  );

  useEffect(() => {
    dispatch(getMyWorkoutsAction());
  }, [dispatch]);

  return (
    <div id="my-workouts">
      <h5>My Workouts</h5>
      {!chatGPTState.fulfilled && !chatGPTState.error && (
        <>
          <PageLoader message="Retrieving Your Workouts" />
        </>
      )}

      {chatGPTState.fulfilled && !chatGPTState.error && (
        <>
          <WorkoutGrid
            workout={chatGPTState.workout}
            exclude={["Completed", "sortIndex"]}
          />
        </>
      )}

      {chatGPTState.rejected && <ActionRejected message={chatGPTState.error} />}
    </div>
  );
};

export default MyWorkouts;
