/* eslint-disable no-shadow */
import {
  window,
  TextEditor,
  Range,
  Position,
  workspace,
  ConfigurationTarget,
} from 'vscode';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Takes config and creates inline decorative text
 * @param {string} contentText Text to be printed.
 * @param {number} line Line number of document text will be printed to.
 * @param {number} column How many chars in (left to right) text will be printed
 * @param {TextEditor} activeEditor Current active text editor.
 */
export const addDeco = (
  contentText: string,
  line: number,
  column: number,
  activeEditor: TextEditor,
) => {
  const decorationType = window.createTextEditorDecorationType({
    after: {
      contentText,
      margin: '20px',
      color: contentText === '200 : OK' ? 'green' : 'red',
    },
  });

  const range = new Range(
    new Position(line, column),
    new Position(line, column),
  );

  activeEditor.setDecorations(decorationType, [{ range }]);
};

/**
 * For things you want done on extension activation
 */
export async function init() {
  // Changes user setting to allow input box to stay open when focus is lost
  await workspace
    .getConfiguration()
    .update(
      'workbench.quickOpen.closeOnFocusLost',
      false,
      ConfigurationTarget.Global,
    );
}

/**
 * Takes config and makes axios request
 * @param {AxiosRequestConfig | options} options Config option object of request.
 * @returns {AxiosResponse<any>} Response of the request made.
 */
export function ping(options: AxiosRequestConfig | options) {
  return axios
    .request(options)
    .then(function (response: AxiosResponse<any>) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
}
