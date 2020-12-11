import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInputViewContext, context } from '../redux/reducers/inputContext';

function Sidebar() {
  const dispatch = useDispatch();
  const {inputViewContext} = useSelector(context)

  const handleChange = (value) => {
    dispatch(setInputViewContext(value));
  };

  return (
    <div className="container__sidebar">
      <div className="sidebar">
        <button
          type="button"
          className={inputViewContext === 'header' ? "button__header active" : "button__header"}
          value="header"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Header
        </button>
        <button
          type="button"
          className={inputViewContext === 'data' ? "button__body active" : "button__body"}
          value="data"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Body
        </button>

        <button
          type="button"
          className={inputViewContext === 'cookies' ? "button__cookies active" : "button__cookies"}
          value="cookies"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Cookies
        </button>
        <button
          type="button"
          className={inputViewContext === 'params' ? "button__params active" : "button__params"}
          value="params"
          onClick={(e) => {
            handleChange(e.target.value);
          }}>
          Params
        </button>
        <button
          type="button"
          className={inputViewContext === 'settings' ? "button__settings active" : "button__settings"}
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
