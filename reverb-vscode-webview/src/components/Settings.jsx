import React from 'react';
import ParseForm from './ParseForm';
import { useSelector, useDispatch } from 'react-redux';
import { settings } from '../redux/reducers/viewContextSlice';
import { vscApi, setLoading } from '../redux/reducers/inputStateSlice';

function Settings() {
  const settingsView = useSelector(settings);
  const dispatch = useDispatch()

  return (
    <div className="input__settings" style={{ display: settingsView ? 'block' : 'none' }}>
      <ParseForm />
      <div className="setting__wipe">
        <button
          type="button"
          className="button__wipe"
          title="ERASE"
          onClick={() => {
            dispatch(vscApi({command: 'wipeStorageObject'}));
            dispatch(setLoading(true));
          }}>
          ERASE
        </button>
        <p>erase ALL stored data</p>
      </div>
    </div>
  );
}

export default Settings;
