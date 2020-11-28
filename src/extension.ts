import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as utils from './utils/utils';
import { testEndpoint } from './utils/testEndpoint';
import { configEndpoint } from './utils/configEndpoint';
import ExpressParser from './parser/expressParser';

const startCommandName = 'extension.startExtension';
const webViewPanelTitle = 'reVerb app';
const webViewPanelId = 'reVerb';

let webViewPanel: vscode.WebviewPanel;

async function startCommandHandler(
  context: vscode.ExtensionContext,
): Promise<void> {
  const showOptions = {
    enableScripts: true,
    retainContextWhenHidden: true,
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

async function onPanelDidReceiveMessage(message: any) {
  switch (message.command) {
    case 'get-data':
      console.log(message);
      const data = await vscode.commands.executeCommand('getState');
      webViewPanel.webview.postMessage({
        command: 'data',
        data: data,
      });
      break;
    case 'sendRequest':
      console.log(message);
      const res = await utils.ping(message.config);
      const out = {
        status: res.status || 500,
        headers: res.headers || {},
        data: res.data || undefined,
        method: message.config.method,
        url: message.config.url,
        time: new Date().toLocaleString('en-US', {
          hour12: false,
        }),
      };

      webViewPanel.webview.postMessage({
        command: 'config',
        out,
      });
      break;
  }
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
  vscode.window.registerWebviewPanelSerializer(
    'reVerb',
    new reVerbSerializer(),
  );
  const state = await context.workspaceState.get(`obj`);
  console.log(`INIT STATE =>`, state);

  // vscode.workspace.onDidSaveTextDocument(async (e) => {
  //   const expressParser = new ExpressParser(
  //     'C:/Users/itsme/Documents/test-server-express/server4/src/server.ts',
  //     3004,
  //   );
  //   const data = await expressParser.parse();
  //   let state = await context.workspaceState.get(`obj`);

  //   // preserve existing state
  //   state = Object.assign({}, state, data);
  //   await context.workspaceState.update(`obj`, state);
  // });

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
      await vscode.commands.executeCommand(
        'workbench.action.decreaseViewHeight',
      ),
      await vscode.commands.executeCommand('extension.startExtension'),
      await vscode.commands.executeCommand(
        'workbench.action.closeEditorsToTheLeft',
      );
    setTimeout(function () {
      vscode.commands.executeCommand(
        'workbench.action.webview.openDeveloperTools',
      );
    }, 500);
  });
  const disposable4 = vscode.commands.registerCommand('getState', async () => {
    return await context.workspaceState.get(`obj`);
  });
  const startCommand = vscode.commands.registerCommand(startCommandName, () =>
    startCommandHandler(context),
  );

  context.subscriptions.push(
    startCommand,
    disposable1,
    disposable2,
    disposable3,
    disposable4,
  );
}

class reVerbSerializer implements vscode.WebviewPanelSerializer {
  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
    // `state` is the state persisted using `setState` inside the webview
    console.log(`Got state: ${state}`);

    // Restore the content of our webview.
    //
    // Make sure we hold on to the `webviewPanel` passed in here and
    // also restore any event listeners we need on it.
    webviewPanel.webview.html = getHtmlForWebview();
  }
}

export function deactivate() {
  return;
}
