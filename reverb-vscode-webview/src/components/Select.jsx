import React from 'react';
import { useDispatch } from 'react-redux';

import { makeRequest } from '../redux/reducers/inputStateSlice';
import SelectDomain from './select/SelectDomain';
import SelectPreset from './select/SelectPreset';

function Select() {
  const dispatch = useDispatch();
  return (
    <>
      <SelectDomain />
      <input
        type="button"
        value="send"
        className="button__send"
        onClick={() => dispatch(makeRequest())}
      />
      <SelectPreset />
    </>
  );
}

export default Select;
