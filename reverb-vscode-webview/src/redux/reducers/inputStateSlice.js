/**
 * ************************************
 *
 * @module  inputStateSlice.js
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description This slice holds the master data object and the state of all inputs. It also contains the async thunks
 *              that allow for communication with the extension through reverbPanel.ts
 *
 * ************************************
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const PENDING_REQUESTS = {};

function vscodeFetch(payload) {
  return new Promise((resolve, reject) => {
    let reqId = crypto.getRandomValues(new Uint32Array(4)).join('-');
    vscode.postMessage({ reqId, payload });
    PENDING_REQUESTS[reqId] = { resolve, reject };
  });
}

window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.reqId) {
    let p = PENDING_REQUESTS[message.reqId];
    delete PENDING_REQUESTS[message.reqId];
    if (message.data) {
      p.resolve(message.data);
    } else {
      p.reject(message.err);
    }
  }
});

/**
 * called by App.jsx on initial load only
 */
export const getMasterObject = createAsyncThunk('inputState/getMasterObject', async () => {
  const data = await vscodeFetch({ command: 'dataObjects' });
  return data;
});

/**
 * general use for sending message to extension and recieving response.
 */
export const vscApi = createAsyncThunk('inputState/vscApi', async (payload) => {
  const data = await vscodeFetch(payload);
  return data;
});

export const wipeStorageObject = createAsyncThunk(
  'inputState/wipeStorageObject',
  async (payload, { dispatch }) => {
    const data = await vscodeFetch(payload);
    return data;
  }
);

/**
 * sends port number and returns boolean
 */
export const validatePort = createAsyncThunk('inputState/validatePort', async (payload) => {
  const data = await vscodeFetch({ command: 'validatePort', data: payload });
  return data;
});

/**
 * sends preset object to be saved and returns updated masterDataObject
 */
export const savePreset = createAsyncThunk(
  'inputState/savePreset',
  async (payload, { getState }) => {
    const { inputs } = getState().inputState;

    let preset = {
      name: payload,
      urlState: inputs.urlState,
      headerState: inputs.headerState,
      cookieState: inputs.cookieState,
      dataState: inputs.dataState,
    };

    preset = JSON.parse(JSON.stringify(preset));
    const data = await vscodeFetch({ command: 'savePreset', data: preset });
    return data;
  }
);

/**
 * sends request object and returns axios response object
 */
export const makeRequest = createAsyncThunk(
  'inputState/makeRequest',
  async (payload, { getState }) => {
    const { inputs } = getState().inputState;

    const baseURL = inputs.urlState;
    const method = inputs.methodState;
    const jsonData = inputs.dataState;

    const cookiesArray = inputs.cookieState.cookies
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
    inputs.headerState.headers.forEach((el) => {
      if ([''].includes(el.key) || [''].includes(el.value)) {
        return false;
      }
      headersObject[el.key] = el.value;
    });
    const headers = cookie.length ? { cookie, ...headersObject } : { ...headersObject };

    const request = {
      headers,
      baseURL,
      method,
      data: jsonData,
    };

    const data = await vscodeFetch({ command: 'makeRequest', data: request });
    return data;
  }
);

/**
 * returns inputs to default state
 */
function resetInputs(state) {
  return {
    ...state,
    currentPreset: 'default',
    inputs: {
      ...state.inputs,
      headerState: {
        headers: [],
      },
      cookieState: {
        cookies: [],
      },
      dataState: '',
    },
  };
}

export const inputStateSlice = createSlice({
  name: 'inputState',
  initialState: {
    inputs: {
      urlState: 'default',
      methodState: 'GET',
      headerState: {
        headers: [],
      },
      cookieState: {
        cookies: [],
      },
      dataState: '',
    },
    storage: {
      masterObject: {
        paths: {},
        urls: {},
        presets: {},
        serverPaths: [],
        rootDirectory: '',
      },
    },
    requestResult: {},
    currentPreset: 'default',
    validPort: true,
    loading: true,
  },
  reducers: {
    setUrlState: (state, action) => {
      const { url, path } = JSON.parse(action.payload);
      const newState = resetInputs(state);
      newState.inputs.urlState = url;
      if (path !== 'default') {
        vscode.postMessage({ payload: { command: 'openFileInEditor', data: path } });
      }

      return newState;
    },
    setMethodState: (state, action) => {
      const method = action.payload;
      state.inputs.methodState = method;
      return state;
    },
    setHeaderState: (state, action) => {
      state.inputs.headerState = action.payload;
      return state;
    },
    setCookieState: (state, action) => {
      state.inputs.cookieState = action.payload;
      return state;
    },
    setDataState: (state, action) => {
      state.inputs.dataState = action.payload;

      // if user is adding to body and they have not set 'content type' headers, add 'application/json'
      let _headers = 0;
      JSON.parse(JSON.stringify(state.inputs.headerState.headers)).forEach((header) => {
        if (header.key === 'Content-Type') {
          _headers++;
        }
      });
      if (state.inputs.dataState.length > 0 && _headers === 0) {
        state.inputs.headerState.headers.unshift({
          key: 'Content-Type',
          value: 'application/json',
        });
      }
      return state;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      return state;
    },
    setCurrentPreset: (state, action) => {
      if (action.payload === 'default' || action.payload === undefined) {
        state = resetInputs(state);
      } else {
        state.currentPreset = action.payload;
        state.inputs.headerState =
          state.storage.masterObject.presets[action.payload].headerState;
        state.inputs.cookieState =
          state.storage.masterObject.presets[action.payload].cookieState;
        state.inputs.dataState = state.storage.masterObject.presets[action.payload].dataState;
      }
      return state;
    },
  },
  extraReducers: {
    [getMasterObject.fulfilled]: (state, action) => {
      state.storage.masterObject = action.payload.data;
      state.loading = false;
      return state;
    },
    [vscApi.fulfilled]: (state, action) => {
      if (action.payload.command !== 'wipeStorageObject') {
        state.storage.masterObject = action.payload.data;
      }
      return state;
    },
    [savePreset.fulfilled]: (state, action) => {
      state.storage.masterObject = action.payload.data;
      state.currentPreset = action.payload.preset;
      return state;
    },
    [validatePort.fulfilled]: (state, action) => {
      state.validPort = action.payload.data;
      return state;
    },
    [makeRequest.fulfilled]: (state, action) => {
      state.requestResult = action.payload.data;
      return state;
    },
    [wipeStorageObject.fulfilled]: (state, action) => {
      state.storage.masterObject = action.payload.data;
      return state;
    },
  },
});

export const {
  setUrlState,
  setMethodState,
  setHeaderState,
  setCookieState,
  setDataState,
  setLoading,
  setCurrentPreset,
} = inputStateSlice.actions;

export const inputState = (state) => state.inputState;
export const currentUrl = (state) => state.inputState.inputs.urlState;
export const currentMethod = (state) => state.inputState.inputs.methodState;
export const headerState = (state) => state.inputState.inputs.headerState;
export const cookieState = (state) => state.inputState.inputs.cookieState;
export const dataState = (state) => state.inputState.inputs.dataState;
export const loading = (state) => state.inputState.loading;
export const validPort = (state) => state.inputState.validPort;
export const requestResult = (state) => state.inputState.requestResult;
export const currentPreset = (state) => state.inputState.currentPreset;
export const paths = (state) => state.inputState.storage.masterObject.paths;
export const urls = (state) => state.inputState.storage.masterObject.urls;
export const presets = (state) => state.inputState.storage.masterObject.presets;
export const serverPaths = (state) => state.inputState.storage.masterObject.serverPaths;
export const rootDirectory = (state) => state.inputState.storage.masterObject.rootDirectory;

export default inputStateSlice.reducer;
