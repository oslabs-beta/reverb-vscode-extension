/**
 * ************************************
 *
 * @module  extensionVariables.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Declares 'ext' namespace and variables that will live on it.
 *              Initializes workspace settings, output window, treeview and decorator types.
 *
 * ************************************
 */

import {
    ExtensionContext,
    workspace,
    window,
    OutputChannel,
    ConfigurationTarget,
    commands,
    WebviewPanel,
} from 'vscode';
import ReverbTreeProvider from './modules/reverbTreeProvider';
import Watcher from './modules/Watcher';
import Decorator from './modules/Decorator';
import ReverbPanel from './webview/ReverbPanel';
import * as utils from './utils/utils';

export namespace ext {
    export let context: ExtensionContext;
    export let outputChannel: OutputChannel;
    export let treeView: ReverbTreeProvider | undefined;
    export let userConfig: UserConfigObject | undefined;
    export let watcher: Watcher | undefined;
    export let decorator: Decorator;
    export const workspaceObj: () => WorkspaceObj | undefined = () =>
        ext.context.workspaceState.get(`obj`);
    export const presetsObject: () => PresetsObject | undefined = () =>
        ext.context.workspaceState.get(`presets`);
    export const userConfigObj: () => UserConfigObject | undefined = () =>
        ext.context.workspaceState.get(`userConfigs`);
    export const setContext = <T>(ctx: string, value: T) =>
        commands.executeCommand('setContext', ctx, value);
    export const registerCommand = (
        command: string,
        callback: (...args: any[]) => any,
        thisArg?: any,
    ) => context.subscriptions.push(commands.registerCommand(command, callback, thisArg));
}

export function initializeExtensionVariables(ctx: ExtensionContext) {
    workspace
        .getConfiguration()
        .update('workbench.quickOpen.closeOnFocusLost', false, ConfigurationTarget.Global);

    ext.context = ctx;
    ext.outputChannel = window.createOutputChannel('reVerb');

    if (!ext.decorator) ext.decorator = new Decorator();
    ext.decorator.initDecorator();

    if (!ext.treeView) {
        ext.treeView = new ReverbTreeProvider(workspace.rootPath || '', ext.workspaceObj());
        ext.treeView.tree = window.createTreeView('paths', {
            treeDataProvider: ext.treeView,
        });
        ext.treeView.tree.onDidChangeSelection((e) => {
            console.log(e);
            const uri = utils.convert(e.selection[0].label);
            commands.executeCommand('extension.openFileInEditor', uri);
        });
    }

    if (window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        window.registerWebviewPanelSerializer(ReverbPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any) {
                console.log(`Got state: ${state}`);
                ReverbPanel.revive(webviewPanel, ext.context.extensionUri);
            },
        });
    }
}
