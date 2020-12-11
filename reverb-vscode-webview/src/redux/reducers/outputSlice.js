/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const outputSlice = createSlice({
  name: 'output',
  initialState: {
    watchOutput: [],
    verboseOutput: {
      data: {},
      headers: {},
      status: '',
      config: {},
    },
  },
  reducers: {
    setVerboseOutput: (state, action) => {
      state.verboseOutput = action.payload;
      return state;
    },
    setWatchOutput: (state, action) => {
      state.watchOutput = action.payload;
      return state;
    },
  },
});

export const { setVerboseOutput, setWatchOutput } = outputSlice.actions;

export const output = (state) => state.output;

export default outputSlice.reducer;
