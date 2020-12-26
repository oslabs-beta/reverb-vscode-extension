import React, { useState } from 'react';
import ParseForm from './ParseForm';
import { useSelector, useDispatch } from 'react-redux';
import { settings } from '../redux/reducers/viewContextSlice';
import { wipeStorageObject } from '../redux/reducers/inputStateSlice';

function Settings() {
  const [confirm, setConfirm] = useState(false);
  const [erased, setErased] = useState(false);

  const settingsView = useSelector(settings);
  const dispatch = useDispatch();

  return (
    <div className="input__settings" style={{ display: settingsView ? 'block' : 'none' }}>
      <ParseForm />
      <div className="setting__wipe" style={{ display: confirm ? 'none' : 'flex' }}>
        <button
          type="button"
          className="button__wipe"
          title="ERASE"
          onClick={() => {
            setConfirm(true);
          }}>
          ERASE
        </button>
        <p>
          erase <u>ALL</u> stored data
        </p>
      </div>
      <div className="setting__wipe" style={{ display: confirm && !erased ? 'flex' : 'none' }}>
        <p style={{ color: 'red' }}>Are you sure?</p>
        <button
          type="button"
          className="button__wipe yes"
          title="YES"
          onClick={() => {
            dispatch(wipeStorageObject({ command: 'wipeStorageObject' }));
            setErased(true);
            setTimeout(() => {
              setErased(false);
              setConfirm(false);
            }, 2000);
          }}>
          YES
        </button>
        <button
          type="button"
          className="button__wipe no"
          title="NO"
          onClick={() => {
            setConfirm(false);
          }}>
          NO
        </button>
      </div>
      <div className="setting__wipe" style={{ display: erased ? 'flex' : 'none' }}>
        <p style={{ color: 'green', fontSize: '1.3rem' }}>Storage Deleted!</p>
      </div>
    </div>
  );
}

export default Settings;
