/**
 * ************************************
 *
 * @module  viewContextSlice.js
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description This slice is for keeping track or the 'view' state of the webview. It tracks which
 *              tabs/inputs are currenly selected and active.
 *
 * ************************************
 */

import { createSlice } from '@reduxjs/toolkit';

export const viewContextSlice = createSlice({
  name: 'viewContext',
  initialState: {
    header: true,
    data: false,
    cookies: false,
    param: false,
    settings: false,
    currentView: 'header',
    outputTabContext: 'response',
  },
  reducers: {
    setInputViewContext: (state, action) => {
      const value = action.payload;
      for (const key in state) {
        if (state[key] == true) state[key] = false;
      }
      state[value] = true;
      return state;
    },
    setOutputTabContext: (state, action) => {
      state.outputTabContext = action.payload;
      return state;
    },
  },
});

export const viewContext = (state) => state.viewContext;
export const header = (state) => state.viewContext.header;
export const data = (state) => state.viewContext.data;
export const cookies = (state) => state.viewContext.cookies;
export const params = (state) => state.viewContext.params;
export const settings = (state) => state.viewContext.settings;
export const currentView = (state) => state.viewContext.currentView;
export const outputTabContext = (state) => state.viewContext.outputTabContext;

export const { setInputViewContext, setOutputTabContext } = viewContextSlice.actions;

export default viewContextSlice.reducer;
