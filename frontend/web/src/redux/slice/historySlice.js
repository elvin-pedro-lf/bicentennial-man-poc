import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// INITIAL STATE
const initialState = {
  pending: false,
  fulfilled: false,
  rejected: false,
  history: null,
  error: null,
};

// CREATE ACTION
export const getMyHistoryAction = createAsyncThunk(
  "ChatGPT/getMyHistory",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const currentTimeInMillis = new Date().getTime();
      if (
        !localStorage.getItem("MY_HISTORY_LOADED") ||
        currentTimeInMillis >= localStorage.getItem("MY_HISTORY_EXPIRATION")
      ) {
        let response = await axios.get(
          `${process.env.REACT_APP_LFCONNECT_FUNCTIONS_DOMAIN}/openai/${
            process.env.REACT_APP_LFCONNECT_FUNCTIONS_VERSION
          }/chat/${process.env.REACT_APP_TEST_HALO_UUID}${
            process.env.REACT_APP_LFCONNECT_FUNCTIONS_KEY || ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        localStorage.setItem("MY_HISTORY_LOADED", true);
        localStorage.setItem("MY_HISTORY_DATA", JSON.stringify(response.data));
        localStorage.setItem(
          "MY_HISTORY_EXPIRATION",
          new Date().getTime() + 600000
        ); // expires in 10 minutes
        return response.data;
      } else {
        return JSON.parse(localStorage.getItem("MY_HISTORY_DATA"));
      }
    } catch (error) {
      console.log("********************** getMyHistoryAction.ERROR: ", error);
      return rejectWithValue(error.message);
    }
  }
);

// CREATE SLICE
const historyFromChatGPTSlice = createSlice({
  name: "ChatGPTMyHistory",
  initialState,
  extraReducers: (builder) => {
    //get history
    builder.addCase(getMyHistoryAction.pending, (state, action) => {
      state.pending = true;
      state.fulfilled = false;
      state.rejected = false;
      state.history = null;
      state.error = null;
    });
    builder.addCase(getMyHistoryAction.fulfilled, (state, action) => {
      state.pending = false;
      state.fulfilled = true;
      state.rejected = false;
      state.history = action.payload;
      state.error = null;
    });
    builder.addCase(getMyHistoryAction.rejected, (state, action) => {
      state.pending = false;
      state.fulfilled = false;
      state.rejected = true;
      state.history = null;
      state.error = action.payload;
    });
  },
});

// CREATE REDUCER
const historyFromChatGPTReducer = historyFromChatGPTSlice.reducer;
export default historyFromChatGPTReducer;
