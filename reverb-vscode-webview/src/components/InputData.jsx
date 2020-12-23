/**
 * ************************************
 *
 * @module  inputData.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description user input for data/body
 *
 * ************************************
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/lint.css';
const jsonlint = require('jsonlint-mod');
window.jsonlint = jsonlint;

import { setDataState, dataState } from '../redux/reducers/inputStateSlice';
import { data } from '../redux/reducers/viewContextSlice';

function InputData() {
  const _dataState = useSelector(dataState);
  const dataView = useSelector(data);
  const dispatch = useDispatch();

  return (
    <div className="input__data" style={{ display: dataView ? 'block' : 'none' }}>
      <CodeMirror
        value={_dataState}
        options={{
          mode: 'application/json',
          lint: true,
          lineNumbers: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers'],
          autoCloseTags: true,
          lineWrapping: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          theme: 'material',
        }}
        editorDidMount={(ed) => {
          ed.refresh();
        }}
        onBeforeChange={(editor, data, value) => {
          dispatch(setDataState(value));
        }}
      />
    </div>
  );
}

export default InputData;
