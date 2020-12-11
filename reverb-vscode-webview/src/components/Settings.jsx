/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { context, setWatchState } from '../redux/reducers/inputContext';
import ParseForm from './ParseForm';

function Settings() {
  return (
    <div className="input__settings">
      <ParseForm />

      <div className="setting__wipe">
        <button
          type="button"
          className="button__wipe"
          title="ERASE"
          onClick={() => {
            // eslint-disable-next-line no-undef
            return vscode.postMessage({
              command: 'deleteRoutesObject',
            });
          }}>
          ERASE
        </button>
        <p>Erase ALL stored data</p>
      </div>
    </div>
  );
}

export default Settings;
