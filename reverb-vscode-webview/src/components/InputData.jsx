/* eslint-disable import/imports-first */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { context, setDataInputContext } from '../redux/reducers/inputContext';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';

function InputData() {
  const { dataInputContext } = useSelector(context);
  const dispatch = useDispatch();

  return (
    <div className="input__data">
      <CodeMirror
        value={dataInputContext}
        options={{
          mode: 'javascript',
          lineNumbers: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
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
