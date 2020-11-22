import * as vscode from 'vscode';
import * as utils from './utils/utils';
import { testEndpoint } from './utils/testEndpoint';
import { getRanges } from './parser/utils/ast';
import * as fs from 'fs';

// runs on extension startup
export async function activate(context: vscode.ExtensionContext) {
  const { rootPath } = vscode.workspace;
  utils.init(rootPath);
  // wipe storage on start for dev testing
  await context.workspaceState.update('obj', undefined);

  const disposable1 = vscode.commands.registerCommand(
    'extension.testRoute',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return;
      }
      // testEndpoint(context);
      const FILETEXT = fs.readFileSync(
        activeEditor.document.uri.path.slice(1),
        'utf8',
      );
      const output = getRanges(FILETEXT);
      console.log(output);
    },
  );

  context.subscriptions.push(disposable1);
}

export function deactivate() {
  return;
}
