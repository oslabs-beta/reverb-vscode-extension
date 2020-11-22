/* eslint-disable no-shadow */
import {
  window,
  TextEditor,
  Range,
  Position,
  workspace,
  ConfigurationTarget,
} from 'vscode';
import axios from 'axios';

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

// export function writeOutput(message: string) {
//   window.
// }

export function ping(options: options) {
  return axios
    .request(options)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
}

export function loading(method: 'GET', url: string) {
  window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: 'I am long running!',
      cancellable: true,
    },
    (progress, token) => {
      token.onCancellationRequested(() => {
        console.log('User canceled the long running operation');
      });

      progress.report({ increment: 0 });

      setTimeout(() => {
        progress.report({
          increment: 10,
          message: 'I am long running! - still going...',
        });
      }, 1000);

      setTimeout(() => {
        progress.report({
          increment: 40,
          message: 'I am long running! - still going even more...',
        });
      }, 2000);

      setTimeout(() => {
        progress.report({
          increment: 50,
          message: 'I am long running! - almost there...',
        });
      }, 3000);

      const p = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });

      return p;
    },
  );
}
