import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// INITIAL STATE
const initialState = {
  pending: false,
  fulfilled: false,
  rejected: false,
  workout: null,
  error: null,
};

// CREATE ACTION
export const getMyWorkoutsAction = createAsyncThunk(
  "ChatGPT/getMyWorkouts",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const currentTimeInMillis = new Date().getTime();
      if (
        !localStorage.getItem("MY_WORKOUT_LOADED") ||
        currentTimeInMillis >= localStorage.getItem("MY_WORKOUT_EXPIRATION")
      ) {
        let response = await axios.get(
          `${process.env.REACT_APP_LFCONNECT_FUNCTIONS_DOMAIN}/openai/${
            process.env.REACT_APP_LFCONNECT_FUNCTIONS_VERSION
          }/workouts/${process.env.REACT_APP_TEST_HALO_UUID}${
            process.env.REACT_APP_LFCONNECT_FUNCTIONS_KEY || ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        localStorage.setItem("MY_WORKOUT_LOADED", true);
        localStorage.setItem("MY_WORKOUT_DATA", JSON.stringify(response.data));
        localStorage.setItem(
          "MY_WORKOUT_EXPIRATION",
          new Date().getTime() + 600000
        ); // expires in 10 minutes
        return response.data;
      } else {
        return JSON.parse(localStorage.getItem("MY_WORKOUT_DATA"));
      }
    } catch (error) {
      console.log("********************** getMyWorkoutsAction.ERROR: ", error);
      return rejectWithValue(error.message);
    }
  }
);

// CREATE SLICE
const workoutsFromChatGPTSlice = createSlice({
  name: "ChatGPTMyWorkouts",
  initialState,
  extraReducers: (builder) => {
    //get workout
    builder.addCase(getMyWorkoutsAction.pending, (state, action) => {
      state.pending = true;
      state.fulfilled = false;
      state.rejected = false;
      state.workout = null;
      state.error = null;
    });
    builder.addCase(getMyWorkoutsAction.fulfilled, (state, action) => {
      state.pending = false;
      state.fulfilled = true;
      state.rejected = false;
      state.workout = action.payload;
      state.error = null;
    });
    builder.addCase(getMyWorkoutsAction.rejected, (state, action) => {
      state.pending = false;
      state.fulfilled = false;
      state.rejected = true;
      state.workout = null;
      state.error = action.payload;
    });
  },
});

// CREATE REDUCER
const workoutsFromChatGPTReducer = workoutsFromChatGPTSlice.reducer;
export default workoutsFromChatGPTReducer;
