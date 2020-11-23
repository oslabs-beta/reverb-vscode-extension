import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as utils from './utils/utils';
import { testEndpoint } from './utils/testEndpoint';
import { configEndpoint } from './utils/configEndpoint';

const startCommandName = 'extension.startExtension';
const webViewPanelTitle = 'reVerb config';
const webViewPanelId = 'reactExtension';

let webViewPanel: vscode.WebviewPanel;

async function startCommandHandler(
  context: vscode.ExtensionContext,
): Promise<void> {
  const showOptions = {
    enableScripts: true,
  };

  const panel = vscode.window.createWebviewPanel(
    webViewPanelId,
    webViewPanelTitle,
    vscode.ViewColumn.Active,
    showOptions,
  );

  panel.webview.html = getHtmlForWebview();
  panel.webview.onDidReceiveMessage(
    onPanelDidReceiveMessage,
    undefined,
    context.subscriptions,
  );

  panel.onDidDispose(onPanelDispose, null, context.subscriptions);

  webViewPanel = panel;
}

function onPanelDispose(): void {
  // Clean up panel here
}

function onPanelDidReceiveMessage(message: any) {
  switch (message.command) {
    case 'showInformationMessage':
      vscode.window.showInformationMessage(message.text);
      return;

    case 'getDirectoryInfo':
      runDirCommand((result: string) =>
        webViewPanel.webview.postMessage({
          command: 'getDirectoryInfo',
          directoryInfo: result,
        }),
      );
      return;
  }
}

function runDirCommand(callback: {
  (result: string): Thenable<boolean>;
  (arg0: any): void;
}) {
  const spawn = require('child_process').spawn;
  const cp = spawn(process.env.comspec, ['/c', 'dir']);

  cp.stdout.on('data', function (data: any) {
    const dataString = data.toString();

    callback(dataString);
  });

  cp.stderr.on('data', function (data: any) {
    // No op
  });
}

function getHtmlForWebview(): string {
  try {
    const reactApplicationHtmlFilename = 'index.html';
    const htmlPath = path.join(__dirname, reactApplicationHtmlFilename);
    const html = fs.readFileSync(htmlPath).toString();

    return html;
  } catch (e) {
    return `Error getting HTML for web view: ${e}`;
  }
}

export async function activate(context: vscode.ExtensionContext) {
  // uncomment to wipe storage
  // await context.workspaceState.update(`obj`, undefined);
  const state = await context.workspaceState.get(`obj`);
  console.log(`INIT STATE =>`, state);

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

  const disposable3 = vscode.commands.registerCommand('splitDown', async () => {
    await testOpenBelow();
    async function testOpenBelow() {
      const x = vscode.window.activeTextEditor;
      await vscode.commands.executeCommand('workbench.action.focusBelowGroup');
      const y = vscode.window.activeTextEditor;
      if (x != y) {
        await vscode.commands.executeCommand(
          'workbench.action.closeEditorsInGroup',
        );
        await testOpenBelow();
      }
    }

    await vscode.commands.executeCommand('workbench.action.closePanel'),
      await vscode.commands.executeCommand('workbench.action.splitEditorDown'),
      await vscode.commands.executeCommand(
        'workbench.action.decreaseViewHeight',
      ),
      await vscode.commands.executeCommand(
        'workbench.action.decreaseViewHeight',
      ),
      await vscode.commands.executeCommand('extension.startExtension'),
      await vscode.commands.executeCommand(
        'workbench.action.closeEditorsToTheLeft',
      );
  });
  const startCommand = vscode.commands.registerCommand(startCommandName, () =>
    startCommandHandler(context),
  );

  context.subscriptions.push(
    startCommand,
    disposable1,
    disposable2,
    disposable3,
  );
}

export function deactivate() {
  return;
}
