import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOutputTabContext, context } from '../redux/reducers/inputContext';
import { output } from '../redux/reducers/outputSlice';

function OutputHeader({ watchState }) {
  const dispatch = useDispatch();
  const { outputTabContext } = useSelector(context);
  const { verboseOutput } = useSelector(output);

  const size = verboseOutput.headers['content-length'];

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
        return 'var(--vscode-button-secondaryBackground)';
    }
  }
  return (
    <div className="output__header">
      <div className="header__verbose">
        <div className="header__nav">
          <button
            type="button"
            className={
              outputTabContext === 'response' ? 'button__response selected' : 'button__response '
            }
            onClick={() => dispatch(setOutputTabContext('response'))}>
            response
          </button>
          <button
            type="button"
            className={
              outputTabContext === 'header' ? 'button__header selected' : 'button__header '
            }
            onClick={() => dispatch(setOutputTabContext('header'))}>
            header
          </button>
          <button
            type="button"
            className={outputTabContext === 'info' ? 'button__info selected' : 'button__info '}
            onClick={() => dispatch(setOutputTabContext('info'))}>
            preview
          </button>
          <button
            type="button"
            className={outputTabContext === 'main' ? 'button__main selected' : 'button__main '}
            onClick={() => dispatch(setOutputTabContext('main'))}>
            watcher
          </button>
        </div>

        <div className="header__metrics">
          <span title="status code" style={{ backgroundColor: colorCode(verboseOutput.status) }}>
            {verboseOutput.status ? verboseOutput.status : ' - '}
          </span>
          <span title={`${verboseOutput.resTime || ''} milliseconds`}>
            {verboseOutput.resTime === undefined ? ' - ' : `${verboseOutput.resTime} ms`}
          </span>
          <span title={`${size || ''} bytes`}>{size === undefined ? ' - ' : `${size} b`}</span>
        </div>

        <button
          type="button"
          className="button__terminal"
          title="Show Terminal"
          onClick={() => {
            return vscode.postMessage({
              command: 'openTerminal',
            });
          }}>
          {'>_'}
        </button>
      </div>
    </div>
  );
}

export default OutputHeader;
