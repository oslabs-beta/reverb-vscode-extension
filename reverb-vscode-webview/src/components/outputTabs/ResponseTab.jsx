import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useSelector } from 'react-redux';
import { requestResult } from '../../redux/reducers/inputStateSlice';
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

function ResponseTab() {
  const { data } = useSelector(requestResult);
  const cmOptions = {
    theme: 'material',
    height: 'auto',
    viewportMargin: Infinity,
    mode: {
      name: 'javascript',
      json: true,
      statementIndent: 2,
    },
    lineNumbers: true,
    lineWrapping: true,
    indentWithTabs: false,
    tabSize: 2,
  };
  return (
    <div className="verbose__response">
      <CodeMirror value={JSON.stringify(data, null, 2)} options={cmOptions} autoCursor={false} />
    </div>
  );
}

export default ResponseTab;
