import { createSlice } from "@reduxjs/toolkit";

export const configsSlice = createSlice({
  name: "configs",
  initialState: [],
  reducers: {
    setConfigs: (state, action) => {
      console.log("configsSlice.js => setConfigs => action:", action.payload);
      state.push(action.payload);
      return state;
    },
  },
});

export const { setConfigs } = configsSlice.actions;

export const configs = (state) => state.configs;

export default configsSlice.reducer;
