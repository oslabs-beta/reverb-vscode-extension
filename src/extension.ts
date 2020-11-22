import * as vscode from 'vscode';
import * as utils from './utils/utils';
import { testEndpoint } from './utils/testEndpoint';
import { configEndpoint } from './utils/configEndpoint';

export async function activate(context: vscode.ExtensionContext) {
  // uncomment to wipe storage
  // await context.workspaceState.update(`obj`, undefined);
  console.log(`INIT STATE => ${await context.workspaceState.get(`obj`)}`);

  // Init output window. Needs to be passed to functions that use it.
  const outputWindow: vscode.OutputChannel = vscode.window.createOutputChannel(
    'reVerb',
  );
  outputWindow.appendLine('---reVerb initialized---');
  utils.init();

  /**
   * Takes config and makes axios request
   * @param {ExtensionContext} context context provided by vscode during activation
   * @param {vscode.OutputChannel} outputWindow reVerb output initialized in extension.ts
   */
  const disposable1 = vscode.commands.registerCommand(
    'extension.testRoute',
    async () => {
      testEndpoint(context, outputWindow);
    },
  );

  const disposable2 = vscode.commands.registerCommand(
    'extension.configRoute',
    async () => {
      // only for testing. Just changes GET to PUT for validation. See file for info.
      configEndpoint(context);
    },
  );

  context.subscriptions.push(disposable1, disposable2);
}

export function deactivate() {
  return;
}
