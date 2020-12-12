/* eslint-disable import/imports-first */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { context, setDataInputContext } from '../redux/reducers/inputContext';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/lint.css';
const jsonlint = require('jsonlint-mod');
window.jsonlint = jsonlint;

function InputData() {
  const { dataInputContext } = useSelector(context);
  const dispatch = useDispatch();

  return (
    <div className="input__data">
      <CodeMirror
        value={dataInputContext}
        options={{
          mode: 'application/json',
          gutters: ['CodeMirror-lint-markers'],
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          lint: true,
          autoCloseTags: true,
          lineWrapping: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          theme: 'material',
        }}
        onBeforeChange={(editor, data, value) => {
          dispatch(setDataInputContext(value));
        }}
      />
    </div>
  );
}

export default InputData;
