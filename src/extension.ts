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

import { ExtensionContext } from 'vscode';
import { ext, initializeExtensionVariables } from './extensionVariables';
import { ExtCmds } from './commands';

export function activate(context: ExtensionContext) {
    console.log('reVerb is now active!');

    initializeExtensionVariables(context);

    ext.registerCommand('extension.testRoute', ExtCmds.test);
    ext.registerCommand('extension.sendRoutes', ExtCmds.sendRoutes);
    ext.registerCommand('extension.sendPreset', ExtCmds.sendPreset);
    ext.registerCommand('extension.sendUserConfigs', ExtCmds.sendUserConfigs);
    ext.registerCommand('extension.initWebviewForm', ExtCmds.initWebviewForm);
    ext.registerCommand('extension.savePreset', ExtCmds.savePreset);
    ext.registerCommand('extension.deletePreset', ExtCmds.deletePreset);
    ext.registerCommand('extension.validatePort', ExtCmds.validatePort);
    ext.registerCommand('extension.parseServer', ExtCmds.parseServer);
    ext.registerCommand('extension.verboseRequest', ExtCmds.verboseRequest);
    ext.registerCommand('extension.startWatch', ExtCmds.startWatch);
    ext.registerCommand('extension.stopWatch', ExtCmds.stopWatch);
    ext.registerCommand('extension.openWebview', ExtCmds.OpenWebview);
    ext.registerCommand('extension.openTerminal', ExtCmds.OpenTerminal);
    ext.registerCommand('extension.openFileInEditor', ExtCmds.openFileInEditor);
    ext.registerCommand('extension.deleteRoutesObject', ExtCmds.deleteRoutesObject);
}

export function deactivate() {
    console.log('deactivated');
}
