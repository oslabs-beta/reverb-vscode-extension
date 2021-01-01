/**
 * ************************************
 *
 * @module  outputHeader.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description renders output panel tabs and axios response metrics
 *
 * ************************************
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setOutputTabContext, outputTabContext } from '../redux/reducers/viewContextSlice';
import { requestResult } from '../redux/reducers/inputStateSlice';

function OutputHeader() {
  const _outputTabContext = useSelector(outputTabContext);
  const _requestResult = useSelector(requestResult);

  const dispatch = useDispatch();

  // sets background color based on status code
  function colorCode(x) {
    switch (true) {
      case x >= 100 && x < 200:
        return '#B4D5E0';
      case x >= 200 && x < 300:
        return 'rgb(0, 99, 0)';
      case x >= 300 && x < 400:
        return 'rgb(111, 0, 109)';
      case x >= 400 && x < 500:
        return 'rgb(117, 37, 0)';
      case x >= 500 && x < 600:
        return 'rgb(101, 84, 0)';
      default:
        return 'var(--vscode-input-background)';
    }
  }
  let size;
  if (_requestResult.headers) {
    size = _requestResult.headers['content-length'];
  }
  return (
    <div className="output__header flexR">
      <div className="header__verbose flexR">
        <div className="header__nav flexR">
          <button
            type="button"
            className={
              _outputTabContext === 'response' ? 'button__response selected' : 'button__response '
            }
            onClick={() => dispatch(setOutputTabContext('response'))}>
            response
          </button>
          <button
            type="button"
            className={
              _outputTabContext === 'header' ? 'button__header selected' : 'button__header '
            }
            onClick={() => dispatch(setOutputTabContext('header'))}>
            header
          </button>
          {/* <button
            type="button"
            className={_outputTabContext === 'info' ? 'button__info selected' : 'button__info '}
            onClick={() => dispatch(setOutputTabContext('info'))}>
            preview
          </button> */}
        </div>

        <div className="header__metrics flexR">
          <span title="status code" style={{ backgroundColor: colorCode(_requestResult.status) }}>
            {_requestResult.status ? _requestResult.status : ' - '}
          </span>
          <span title={`${_requestResult.resTime || ''} milliseconds`}>
            {_requestResult.resTime === undefined ? ' - ' : `${_requestResult.resTime} ms`}
          </span>
          <span title={`${size || ''} bytes`}>{size === undefined ? ' - ' : `${size} b`}</span>
        </div>

        <button
          type="button"
          className="button__terminal"
          title="Show Terminal"
          onClick={() => {
            return vscode.postMessage({
              payload: {
                command: 'openTerminal',
              },
            });
          }}>
          {'>_'}
        </button>
      </div>
    </div>
  );
}

export default OutputHeader;
