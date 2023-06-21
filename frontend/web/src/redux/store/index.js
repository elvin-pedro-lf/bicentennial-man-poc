import { configureStore } from "@reduxjs/toolkit";
import getBlockOfWorkoutFromChatGPTReducer from "../slice/newClientSlice";
import workoutsFromChatGPTReducer from "../slice/workoutsSlice";
import historyFromChatGPTReducer from "../slice/historySlice";

// store
const store = configureStore({
  reducer: {
    getBlockOfWorkoutFromChatGPT: getBlockOfWorkoutFromChatGPTReducer,
    workoutsFromChatGPT: workoutsFromChatGPTReducer,
    historyFromChatGPT: historyFromChatGPTReducer,
  },
});

export default store;
