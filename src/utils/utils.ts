/* eslint-disable no-shadow */
import {
  window,
  TextEditor,
  Range,
  Position,
  workspace,
  ConfigurationTarget,
} from 'vscode';
import { existsSync, mkdir, writeFile, readFile } from 'fs';
import axios from 'axios';

export function addDeco(
  contentText: string,
  line: number,
  column: number,
  activeEditor: TextEditor,
) {
  const decorationType = window.createTextEditorDecorationType({
    after: {
      contentText,
      margin: '20px',
    },
  });

  const range = new Range(
    new Position(line, column),
    new Position(line, column),
  );

  activeEditor.setDecorations(decorationType, [{ range }]);
}
export async function init(rootPath: string | undefined) {
  await workspace
    .getConfiguration()
    .update(
      'workbench.quickOpen.closeOnFocusLost',
      false,
      ConfigurationTarget.Global,
    );
  // create reVerb output window
  const outputWindow = window.createOutputChannel('reVerb');
  outputWindow.appendLine('---reVerb initialized---');
}

export function ping(method: 'GET', url: string) {
  return axios({
    method,
    url,
  });
}
