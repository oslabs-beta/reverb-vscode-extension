import { createSlice } from "@reduxjs/toolkit";

export const routesSlice = createSlice({
  name: "routes",
  initialState: {},
  reducers: {
    setVsState: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setVsState } = routesSlice.actions;

export const routes = (state) => state.routes;

export default routesSlice.reducer;
