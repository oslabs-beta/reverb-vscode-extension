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

import { ExtensionContext, WebviewPanel, window } from 'vscode';
import { ext, initializeExtensionVariables } from './extensionVariables';
import ReverbPanel from './webview/ReverbPanel';
import { ExtCmds } from './commands';

export function activate(context: ExtensionContext) {
    initializeExtensionVariables(context);

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

    if (window.registerWebviewPanelSerializer) {
        window.registerWebviewPanelSerializer(ReverbPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any) {
                console.log(`Got state: ${state}`);
                ReverbPanel.revive(webviewPanel, ext.context.extensionUri);
            },
        });
    }
}

export function deactivate() {
    console.log('deactivated');
}
