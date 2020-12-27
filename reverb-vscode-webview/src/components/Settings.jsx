import React from 'react';
import { useSelector } from 'react-redux';

import { settings } from '../redux/reducers/viewContextSlice';
import EraseStorage from './settings/EraseStorage';
import ParseForm from './settings/ParseForm';

function Settings() {
  const settingsView = useSelector(settings);

  return (
    <div className="input__settings" style={{ display: settingsView ? 'block' : 'none' }}>
      <ParseForm />
      <EraseStorage />
    </div>
  );
}

export default Settings;
