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

export function activate(context: vscode.ExtensionContext) {
  let serverParser;

  // Activate the appropriate parser for the server type
  switch (CONFIG.serverType) {
    case serverTypes.EXPRESS:
      console.log('Parsing Express server');
      serverParser = new ExpressParser(CONFIG.serverPath, CONFIG.portNumber);
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
      testEndpoint(context);
      // const FILETEXT = fs.readFileSync(
      //   'C:/Users/itsme/Documents/test-server-express/server4/src/routes/ApiRouter.ts',
      //   'utf8',
      // );
      // const output = getRanges(FILETEXT);
      // console.log(output);
    },
  );

  context.subscriptions.push(disposable1);
}

export function deactivate() {
  return;
}
