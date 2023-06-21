import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// INITIAL STATE
const initialState = {
  makeAdjustments: false,
  selectedProfileAndPreferences: {
    clientAge: 0,
    clientSexAtBirth: null,
    programLengthInWeeks: 0,
  },
  prompt: null,
  response: null,
  total_tokens: 0,
  pending: false,
  fulfilled: false,
  rejected: false,
  success: false,
  error: null,
  history: [],
  accepted: false,
};

// CREATE ACTION
export const getBlockOfWorkoutFromChatGPTAction = createAsyncThunk(
  "ChatGPT/getBlockOfWorkout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log(
        `***** newClientSlice.js BEFORE - call OPENAI: ${new Date()}`
      );
      let response = await axios.post(
        `${process.env.REACT_APP_LFCONNECT_FUNCTIONS_DOMAIN}/openai/${
          process.env.REACT_APP_LFCONNECT_FUNCTIONS_VERSION
        }/workouts/${process.env.REACT_APP_TEST_HALO_UUID}${
          process.env.REACT_APP_LFCONNECT_FUNCTIONS_KEY || ""
        }`,
        {
          payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`***** newClientSlice.js AFTER - call OPENAI: ${new Date()}`);

      if (payload.source === "firestore") {
        localStorage.setItem("MY_WORKOUT_LOADED", true);
        localStorage.setItem(
          "MY_WORKOUT_DATA",
          response.data.assistant.choices[0].message.content
        );
        localStorage.setItem(
          "MY_WORKOUT_EXPIRATION",
          new Date().getTime() + 600000
        ); // expires in 10 minutes

        localStorage.setItem("MY_HISTORY_LOADED", true);
        localStorage.setItem(
          "MY_HISTORY_DATA",
          JSON.stringify({ chat: response.data.history })
        );
        localStorage.setItem(
          "MY_HISTORY_EXPIRATION",
          new Date().getTime() + 600000
        ); // expires in 10 minutes
      }

      return response.data;
    } catch (error) {
      console.log(
        "********************** getBlockOfWorkoutFromChatGPTAction.ERROR: ",
        error
      );
      return rejectWithValue(error.message);
    }
  }
);

export const storePlanFromChatGPTAction = createAsyncThunk(
  "ChatGPT/storeBlockOfWorkout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_LFCONNECT_FUNCTIONS_DOMAIN}/openai/${
          process.env.REACT_APP_LFCONNECT_FUNCTIONS_VERSION
        }/workouts/${process.env.REACT_APP_TEST_HALO_UUID}${
          process.env.REACT_APP_LFCONNECT_FUNCTIONS_KEY || ""
        }`,
        {
          workout: payload.workout,
          selectedProfileAndPreferences: payload.selectedProfileAndPreferences,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await axios.put(
        `${process.env.REACT_APP_LFCONNECT_FUNCTIONS_DOMAIN}/openai/${
          process.env.REACT_APP_LFCONNECT_FUNCTIONS_VERSION
        }/chat/${process.env.REACT_APP_TEST_HALO_UUID}${
          process.env.REACT_APP_LFCONNECT_FUNCTIONS_KEY || ""
        }`,
        {
          chat: payload.history,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.log(
        "********************** storePlanFromChatGPTAction.ERROR: ",
        error
      );
      return rejectWithValue(error.message);
    }
  }
);

// CREATE SLICE
const getBlockOfWorkoutFromChatGPTSlice = createSlice({
  name: "ChatGPTBlockOfWorkout",
  initialState,
  extraReducers: (builder) => {
    //get block of workout
    builder.addCase(
      getBlockOfWorkoutFromChatGPTAction.pending,
      (state, action) => {
        state.pending = true;
        state.accepted = false;
        state.makeAdjustments = action.meta.arg.makeAdjustments;
        state.prompt = action.meta.arg.displayPrompt;
        state.fulfilled = false;
        state.rejected = false;
        state.error = null;
      }
    );
    builder.addCase(
      getBlockOfWorkoutFromChatGPTAction.fulfilled,
      (state, action) => {
        state.pending = false;
        state.fulfilled = true;
        console.log(
          "content: ",
          action.payload.assistant.choices[0].message.content
        );
        state.response = action.payload.assistant.choices[0].message.content;
        state.total_tokens = action.payload.assistant.usage.total_tokens;
        if (action.payload.source === "firestore") {
          state.history = action.payload.history.map((h) => {
            return { role: h.role, content: h.content };
          });
        } else {
          state.history.push({ role: "user", content: action.payload.user });
          state.history.push({
            role: "assistant",
            content: action.payload.assistant.choices[0].message.content,
          });
        }
        state.selectedProfileAndPreferences.clientAge =
          action.payload.selectedProfileAndPreferences.clientAge;
        state.selectedProfileAndPreferences.clientSexAtBirth =
          action.payload.selectedProfileAndPreferences.clientSexAtBirth;
        state.selectedProfileAndPreferences.programLengthInWeeks =
          action.payload.selectedProfileAndPreferences.programLengthInWeeks;
        state.rejected = false;
        state.error = null;
      }
    );
    builder.addCase(
      getBlockOfWorkoutFromChatGPTAction.rejected,
      (state, action) => {
        state.pending = false;
        state.fulfilled = false;
        state.rejected = true;
        state.error = action.payload;
      }
    );
    //accept plan
    builder.addCase(storePlanFromChatGPTAction.pending, (state, action) => {
      state.pending = true;
      state.prompt =
        '<center>Your information is being saved.<br/>Please stay on this page and DO NOT click the browser\'s "Back" button.</center>';
      state.fulfilled = false;
      state.accepted = false;
      state.rejected = false;
      state.error = null;
    });
    builder.addCase(storePlanFromChatGPTAction.fulfilled, (state, action) => {
      state.pending = false;
      state.fulfilled = true;
      state.accepted = true;
      state.rejected = false;
      state.error = null;
    });
    builder.addCase(storePlanFromChatGPTAction.rejected, (state, action) => {
      state.pending = false;
      state.fulfilled = false;
      state.accepted = false;
      state.rejected = true;
      state.error = action.payload;
    });
  },
});

// CREATE REDUCER
const getBlockOfWorkoutFromChatGPTReducer =
  getBlockOfWorkoutFromChatGPTSlice.reducer;
export default getBlockOfWorkoutFromChatGPTReducer;
