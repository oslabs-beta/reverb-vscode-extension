import { createSlice } from "@reduxjs/toolkit";

export const configsSlice = createSlice({
  name: "configs",
  initialState: {},
  reducers: {
    sendConfig: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { sendConfig } = configsSlice.actions;

export const configs = (state) => state.configs;

export default configsSlice.reducer;
