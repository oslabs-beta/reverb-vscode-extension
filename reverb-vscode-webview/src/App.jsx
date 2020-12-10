/* eslint-disable no-unused-vars */
import React from 'react';
import { useDispatch } from 'react-redux';
import Main from './containers/Main';
import Output from './containers/Output';
import { setVerboseOutput, setWatchOutput } from './redux/reducers/outputSlice';
import { setRoutes } from './redux/reducers/routesSlice';
import {
  setPreset,
  setUserConfigs,
  setRootDir,
  setValidPort,
  setPossibleServerFilePaths,
  setInputViewContext,
} from './redux/reducers/inputContext';

function App() {
  console.log('app render');
  const dispatch = useDispatch();

  window.addEventListener('message', (event) => {
    const message = event.data;
    console.log(message);
    switch (message.command) {
      case 'routesObject':
        if (message.data) {
          dispatch(setRoutes(message.data));
        }
        break;
      case 'presetsObject':
        if (message.data) {
          dispatch(setPreset(message.data));
        }
        break;
      case 'userConfigsObject':
        if (message.data) {
          dispatch(setUserConfigs(message.data));
        } else {
          dispatch(setInputViewContext('settings'));
        }
        break;
      case 'verboseResponse':
        dispatch(setVerboseOutput(message.data));
        break;
      case 'validPort':
        dispatch(setValidPort(message.data));
        break;
      case 'watchOutput':
        dispatch(setWatchOutput(message.data));
        break;
      case 'getServerInfo':
        dispatch(setPossibleServerFilePaths(message.portFiles));
        dispatch(setRootDir(message.rootDir));
        break;
      default:
    }
  });

  return (
    <div className="grid-container">
      <Output />
      <Main />
    </div>
  );
}

export default App;
