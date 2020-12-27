import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeRequest, waiting } from '../redux/reducers/inputStateSlice';
import SelectDomain from './select/SelectDomain';
import SelectPreset from './select/SelectPreset';
import Svg from '../assets/axios.svg';

function Select() {
  const dispatch = useDispatch();
  const _waiting = useSelector(waiting);
  return (
    <>
      <SelectDomain />
      <input
        type="button"
        value="send"
        className="button__send"
        style={{ display: _waiting ? 'none' : 'block' }}
        onClick={() => dispatch(makeRequest())}
      />
      <div className="svg rotate" style={{ display: _waiting ? 'block' : 'none' }}>
        <Svg />
      </div>
      <SelectPreset />
    </>
  );
}

export default Select;
