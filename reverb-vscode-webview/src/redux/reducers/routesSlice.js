/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const routesSlice = createSlice({
  name: 'routes',
  initialState: {},
  reducers: {
    setRoutes: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setRoutes } = routesSlice.actions;

export const routes = (state) => state.routes;

export default routesSlice.reducer;
