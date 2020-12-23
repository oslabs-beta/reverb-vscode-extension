import React from 'react';
import { useDispatch } from 'react-redux';

import SelectDomain from './select/SelectDomain';
import SelectPreset from './select/SelectPreset';
import { makeRequest } from '../redux/reducers/inputStateSlice';

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
