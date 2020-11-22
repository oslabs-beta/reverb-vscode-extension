import * as vscode from 'vscode';
import * as utils from './utils/utils';
import { testEndpoint } from './utils/testEndpoint';
import { configEndpoint } from './utils/configEndpoint';

export async function activate(context: vscode.ExtensionContext) {
  const { rootPath } = vscode.workspace;
  await context.workspaceState.update(`obj`, undefined);
  utils.init(rootPath);

  const disposable1 = vscode.commands.registerCommand(
    'extension.testRoute',
    async () => {
      testEndpoint(context);
    },
  );

  const disposable2 = vscode.commands.registerCommand(
    'extension.configRoute',
    async () => {
      configEndpoint(context);
    },
  );

  context.subscriptions.push(disposable1, disposable2);
}

export function deactivate() {
  return;
}
