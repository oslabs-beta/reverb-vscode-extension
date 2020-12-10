/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const inputContextSlice = createSlice({
  name: 'context',
  initialState: {
    inputViewContext: 'header',
    urlInputContext: '',
    outputTabContext: 'response',
    watchState: 'off',
    methodInputContext: 'GET',
    headerInputContext: [],
    cookieInputContext: [],
    dataInputContext: '{\n\n}',
    possibleServerFilePaths: [],
    userConfigs: {},
    rootDir: '',
    validPort: true,
    currentPreset: 'default',
    presets: {},
  },
  reducers: {
    setWatchState: (state, action) => {
      state.watchState = action.payload;
      if (action.payload === 'on') {
        vscode.postMessage({ command: 'startWatch' });
        state.outputTabContext = 'main';
      } else {
        vscode.postMessage({ command: 'stopWatch' });
        state.outputTabContext = 'response';
      }
      return state;
    },
    setInputViewContext: (state, action) => {
      state.inputViewContext = action.payload;
      if (action.payload === 'settings') {
        vscode.postMessage({
          command: 'userInputPrompt',
        });
      }
      return state;
    },
    setOutputTabContext: (state, action) => {
      state.outputTabContext = action.payload;
      return state;
    },
    setMethodAndUrl: (state, action) => {
      const { method, url } = action.payload;
      const data = url;
      state.methodInputContext = method;
      state.urlInputContext = url;
      vscode.postMessage({ command: 'openFileInEditor', data });
      return state;
    },
    setHeaderInputContext: (state, action) => {
      state.headerInputContext = action.payload;
      return state;
    },
    setUserConfigs: (state, action) => {
      state.userConfigs = action.payload;
      return state;
    },
    setCookieInputContext: (state, action) => {
      state.cookieInputContext = action.payload;
      return state;
    },
    setDataInputContext: (state, action) => {
      state.dataInputContext = action.payload;
      return state;
    },
    setPossibleServerFilePaths: (state, action) => {
      state.possibleServerFilePaths = action.payload;
      return state;
    },
    setRootDir: (state, action) => {
      state.rootDir = action.payload;
      return state;
    },
    setValidPort: (state, action) => {
      state.validPort = action.payload;
      return state;
    },
    setCurrentPreset: (state, action) => {
      state.currentPreset = action.payload;
      state.headerInputContext = action.payload.headerInputContext;
      state.cookieInputContext = action.payload.cookieInputContext;
      state.dataInputContext = action.payload.dataInputContext;
      return state;
    },
    setPreset: (state, action) => {
      state.presets = action.payload;
      return state;
    },
    savePreset: (state, action) => {
      let data = {
        name: action.payload.preset_name,
        url: state.urlInputContext,
        headerInputContext: state.headerInputContext,
        cookieInputContext: state.cookieInputContext,
        dataInputContext: state.dataInputContext,
      };
      state.currentPreset = data;
      data = JSON.parse(JSON.stringify(data));
      vscode.postMessage({ command: 'savePreset', data });
      return state;
    },
    sendVerboseRequest: (state) => {
      const _cookies = JSON.parse(JSON.stringify(state.cookieInputContext));
      const _headers = JSON.parse(JSON.stringify(state.headerInputContext));
      const _data = JSON.parse(JSON.stringify(state.dataInputContext));
      const url = JSON.parse(JSON.stringify(state.urlInputContext));
      const method = JSON.parse(JSON.stringify(state.methodInputContext));
      const cookiesArray = _cookies
        .filter((el) => {
          // No empty key/values
          if ([''].includes(el.key) || [''].includes(el.value)) {
            return false;
          }
          return true;
        })
        .map((el) => {
          return `${el.key} = ${el.value}`;
        });
      const cookie = [...cookiesArray];
      const headersObject = {};
      _headers.forEach((el) => {
        if ([''].includes(el.key) || [''].includes(el.value)) {
          return false;
        }
        headersObject[el.key] = el.value;
      });
      const headers = cookie.length ? { cookie, ...headersObject } : { ...headersObject };

      const data = {
        headers,
        url,
        method,
        _data,
      };
      console.log('MSG => verboseRequest', data);
      vscode.postMessage({ command: 'verboseRequest', data });
      return state;
    },
  },
});

export const {
  setInputViewContext,
  setMethodAndUrl,
  setHeaderInputContext,
  setCookieInputContext,
  setOutputTabContext,
  setPossibleServerFilePaths,
  setRootDir,
  setUserConfigs,
  setValidPort,
  setCurrentPreset,
  setPreset,
  savePreset,
  setDataInputContext,
  sendVerboseRequest,
  setWatchState,
} = inputContextSlice.actions;

export const context = (state) => state.context;

export default inputContextSlice.reducer;
