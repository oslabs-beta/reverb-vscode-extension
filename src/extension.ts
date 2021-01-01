/**
 * ************************************
 *
 * @module  extension.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Registers commands from commands.ts
 *
 * ************************************
 */

import { ExtensionContext, WebviewPanel, window, workspace, commands } from 'vscode';
import { ext, initializeExtensionVariables } from './extensionVariables';
import ReverbPanel from './webview/ReverbPanel';
import { ExtCmds } from './commands';

export function activate(context: ExtensionContext) {
    initializeExtensionVariables(context);

    console.log(ext.context.workspaceState.get(`masterDataObject`));

    ext.registerCommand('extension.dataObjects', ExtCmds.dataObjects);
    ext.registerCommand('extension.savePreset', ExtCmds.savePreset);
    ext.registerCommand('extension.deletePreset', ExtCmds.deletePreset);
    ext.registerCommand('extension.validatePort', ExtCmds.validatePort);
    ext.registerCommand('extension.parseServer', ExtCmds.parseServer);
    ext.registerCommand('extension.verboseRequest', ExtCmds.verboseRequest);
    ext.registerCommand('extension.openWebview', ExtCmds.OpenWebview);
    ext.registerCommand('extension.openTerminal', ExtCmds.OpenTerminal);
    ext.registerCommand('extension.openFileInEditor', ExtCmds.openFileInEditor);
    ext.registerCommand('extension.wipeStorageObject', ExtCmds.wipeStorageObject);
    ext.registerCommand('paths.generateAxios', ExtCmds.GenerateAxios);
    ext.registerCommand('paths.simpleQuery', ExtCmds.simpleQuery);
    ext.registerCommand('extension.rightClickQuery', ExtCmds.rightClickQuery);

    if (window.registerWebviewPanelSerializer) {
        window.registerWebviewPanelSerializer(ReverbPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: WebviewPanel) {
                ReverbPanel.revive(webviewPanel, ext.context.extensionUri);
            },
        });
    }

    workspace.onDidSaveTextDocument((e) => {
        const _data: MasterDataObject | undefined = ext.context.workspaceState.get(
            `masterDataObject`,
        );
        if (_data === undefined) return;
        if (e === undefined) return;

        let pathStr = e.uri.path;
        if (e.uri.path[2] === ':') {
            pathStr = pathStr.slice(1);
        }

        if (_data.index[pathStr]) {
            commands
                .executeCommand('extension.parseServer', {
                    file_path: _data.index[pathStr].serverPath,
                    port: _data.index[pathStr].port,
                })
                .then((res) => {
                    ReverbPanel.currentPanel?.send({
                        update: true,
                        data: { command: 'parseServer', data: res },
                    });
                });
        }
    });
}

export function deactivate() {
    console.log('deactivated');
}
