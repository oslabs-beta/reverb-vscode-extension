import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setInputViewContext } from '../redux/reducers/viewContextSlice';

function Sidebar() {
  const [selected, setSelected] = useState('header');
  const dispatch = useDispatch();

  const sync = (value) => {
    setSelected(value);
    dispatch(setInputViewContext(value));
  };

  return (
    <div className="container__sidebar">
      <div className="sidebar">
        <button
          type="button"
          className={selected === 'header' ? 'button__header active' : 'button__header'}
          value="header"
          onClick={(e) => {
            sync(e.target.value);
          }}>
          header
        </button>
        <button
          type="button"
          className={selected === 'data' ? 'button__body active' : 'button__body'}
          value="data"
          onClick={(e) => {
            sync(e.target.value);
          }}>
          body
        </button>

        <button
          type="button"
          className={selected === 'cookies' ? 'button__cookies active' : 'button__cookies'}
          value="cookies"
          onClick={(e) => {
            sync(e.target.value);
          }}>
          cookies
        </button>
        <button
          type="button"
          className={selected === 'params' ? 'button__params active' : 'button__params'}
          value="params"
          onClick={(e) => {
            sync(e.target.value);
          }}>
          params
        </button>
        <button
          type="button"
          className={selected === 'settings' ? 'button__settings active' : 'button__settings'}
          value="settings"
          onClick={(e) => {
            sync(e.target.value);
          }}>
          settings
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
