import * as vscode from 'vscode';
import * as serverTypes from './constants/serverTypes';
import ExpressParser from './parser/expressParser';
import * as utils from './utils/utils';
import { multiStepInput } from './utils/multiStepInput';

const CONFIG = require('../reverbconfig.json');

export function activate(context: vscode.ExtensionContext) {
  let serverParser;

  // Activate the appropriate parser for the server type
  switch (CONFIG.serverType) {
    case serverTypes.EXPRESS:
      console.log('Parsing Express server');
      serverParser = new ExpressParser(CONFIG.serverPath);
      serverParser.parse();
      break;
    case serverTypes.NODE:
      console.log('NODE support coming soon');
      break;
    default:
      console.log(
        'ERROR: Unsupported server type specified in reverbconfig.json',
      );
  }

  const disposable1 = vscode.commands.registerCommand(
    'extension.testRoute',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return;
      }

      const res = await multiStepInput(context);
      console.log(res);
    },
  );

  context.subscriptions.push(disposable1);
}

export function deactivate() {
  return;
}
