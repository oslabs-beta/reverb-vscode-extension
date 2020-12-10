import React from 'react';
import { useDispatch } from 'react-redux';
import { setInputViewContext } from '../redux/reducers/inputContext';

function Sidebar() {
  console.log('sidebar render');
  const dispatch = useDispatch();

  const handleChange = (value) => {
    dispatch(setInputViewContext(value));
  };

  return (
    <div className="container__sidebar">
      <div className="sidebar">
        <button
          type="button"
          className="button__header"
          value="header"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Header
        </button>
        <button
          type="button"
          className="button__body"
          value="data"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Body
        </button>

        <button
          type="button"
          className="button__cookies"
          value="cookies"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Cookies
        </button>
        <button type="button" className="button__query">
          Query
        </button>
        <button
          type="button"
          className="button__settings"
          value="settings"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Settings
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
