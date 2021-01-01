import React from 'react';
import { useSelector } from 'react-redux';

import { settings } from '../redux/reducers/viewContextSlice';
import EraseStorage from './settings/EraseStorage';
import ParseForm from './settings/ParseForm';

function Settings() {
  const settingsView = useSelector(settings);

  return (
    settingsView && (
      <div className="input__settings">
        <ParseForm />
        <EraseStorage />
      </div>
    )
  );
}

export default Settings;
