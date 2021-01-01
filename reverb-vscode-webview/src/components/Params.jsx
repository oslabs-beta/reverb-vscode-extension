import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUrl, urls, currentMethod, setParamState } from '../redux/reducers/inputStateSlice';

import { params } from '../redux/reducers/viewContextSlice';

function Params() {
  const [paramsArray, setParamsArray] = useState([]);

  const _currentUrl = useSelector(currentUrl);
  const paramsView = useSelector(params);
  const dispatch = useDispatch();

  useEffect(() => {
    if (_currentUrl === 'default') {
      setParamsArray([]);
      return;
    }
    setParamsArray(
      Object.keys(_currentUrl.params).map((param) => {
        return (
          <div className="param flexR" key={param}>
            <span>:{param}</span>
            <input
              placeholder="param value"
              name="paramValue"
              onBlur={(e) => dispatch(setParamState({ name: param, value: e.target.value }))}
            />
          </div>
        );
      })
    );
  }, [_currentUrl]);

  return (
    <div className="input__params" style={{ display: paramsView ? 'block' : 'none' }}>
      {paramsArray}
    </div>
  );
}

export default Params;
