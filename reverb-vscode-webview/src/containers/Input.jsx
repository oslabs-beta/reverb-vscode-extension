import React from 'react';
import InputHeaders from '../components/InputHeaders';
import InputData from '../components/InputData';
import InputCookies from '../components/InputCookies';
import Settings from '../components/Settings';
import Params from '../components/Params';

function Input() {
  return (
    <div className="container__input">
      <InputHeaders />
      <InputData />
      <InputCookies />
      <Params />
      <Settings />
    </div>
  );
}

export default Input;
