import React from 'react';
import { useSelector } from 'react-redux';
import InputHeaders from '../components/InputHeaders';
import InputData from '../components/InputData';
import InputCookies from '../components/InputCookies';
import Settings from '../components/Settings';
import Params from '../components/Params';
import { context } from '../redux/reducers/inputContext';

function Input() {
  
  const { inputViewContext } = useSelector(context);

  function renderGroup(x) {
    switch (x) {
      case 'header':
        return <InputHeaders />;
      case 'data':
        return <InputData />;
      case 'cookies':
        return <InputCookies />;
      case 'params':
        return <Params />;
      case 'settings':
        return <Settings />;
      default:
        return <p>input</p>;
    }
  }

  return <div className="container__input">{renderGroup(inputViewContext)}</div>;
}

export default Input;
