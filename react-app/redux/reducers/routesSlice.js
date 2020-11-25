import { createSlice } from "@reduxjs/toolkit";

export const routesSlice = createSlice({
  name: "routes",
  initialState: {},
  reducers: {
    setRoute: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setRoute } = routesSlice.actions;

export const routes = (state) => state.routes;

export default routesSlice.reducer;
