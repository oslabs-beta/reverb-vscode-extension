import { createSlice } from "@reduxjs/toolkit";

export const routesSlice = createSlice({
  name: "routes",
  initialState: null,
  reducers: {
    setRoutes: (state, action) => {
      console.log("routesSlice.js => setRoutes => action:", action.payload);
      state = action.payload;
      return state;
    },
  },
});

export const { setRoutes } = routesSlice.actions;

export const routes = (state) => state.routes;

export default routesSlice.reducer;
