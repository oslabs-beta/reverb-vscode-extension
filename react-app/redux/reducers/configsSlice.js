import { createSlice } from "@reduxjs/toolkit";

export const configsSlice = createSlice({
  name: "configs",
  initialState: [],
  reducers: {
    setConfig: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setConfig } = configsSlice.actions;

export const configs = (state) => state.configs;

export default configsSlice.reducer;
