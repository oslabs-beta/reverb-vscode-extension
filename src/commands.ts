/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * ************************************
 *
 * @module  commands.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Defines all commands used by the extension.
 *              These commands are registered in extension.ts
 *
 * ************************************
 */

import { workspace, commands, Uri, window, ViewColumn, env } from 'vscode';
import find from 'find-process';
import { ext } from './extensionVariables';
import * as utils from './utils/utils';
import Watcher from './modules/Watcher';
import ReverbPanel from './webview/ReverbPanel';
import { portFiles } from './parser/utils/serverPath';
import ExpressParser from './parser/expressParser';
import ReverbTreeProvider from './modules/reverbTreeProvider';

export namespace ExtCmds {
    export function test(data: any) {
        // utils.initWebviewForm();
        return utils.generateSnippet(data);
    }

    /**
     * Takes config and makes axios request returning detailed response
     * @param {any} query Config option object of request.
     * @returns {any}  Response of the request made.
     */
    export async function verboseRequest(query: any) {
        const data = await utils.ping(query);
        ReverbPanel.currentPanel?.send({
            command: 'verboseResponse',
            data,
        });
    }

    /**
     * Sends routes object to webview or prompts for server info if no routes exist in storage
     */
    export function sendRoutes() {
        let data = ext.workspaceObj();
        if (!data) {
            data = {};
            const rootDir = workspace.workspaceFolders![0].name;
            ReverbPanel.currentPanel?.send({
                command: 'getServerInfo',
                portFiles,
                rootDir,
            });
            ReverbPanel.currentPanel?.send({
                command: 'routesObject',
                data,
            });
        } else {
            ReverbPanel.currentPanel?.send({
                command: 'routesObject',
                data,
            });
        }

        return data;
    }

    /**
     * Sends preset object to webview
     */
    export function sendPreset() {
        let data = ext.presetsObject();
        if (data === undefined) data = {};
        ReverbPanel.currentPanel?.send({
            command: 'presetsObject',
            data,
        });
    }

    /**
     * Sends userconfig object to webview
     */
    export function sendUserConfigs() {
        const data = ext.userConfigObj();
        ReverbPanel.currentPanel?.send({
            command: 'userConfigsObject',
            data,
        });

        return data;
    }
    /**
     * Starts watcher
     */
    export function startWatch() {
        if (!ext.watcher) {
            ext.watcher = new Watcher();
            ext.watcher.initWatcher();
        }
    }

    /**
     * Stops watcher
     */
    export function stopWatch() {
        if (ext.watcher) {
            ext.watcher?.dis1?.dispose();
            ext.watcher?.dis2?.dispose();
            ext.watcher = undefined;
        }
    }

    /**
     * Parses files with supplied port and server file
     * @param {string} data object with port and serverFile
     */
    export function parseServer(data: any) {
        const expressParser = new ExpressParser(data.file_path, data.port);
        const obj = expressParser.parse();

        const _routesObject = ext.workspaceObj();
        const _configObject = ext.userConfigObj();

        const routesObject = { ..._routesObject, ...obj[0] };
        const configObject = { ..._configObject, ...obj[1] };

        ext.context.workspaceState.update(`obj`, routesObject);
        ext.context.workspaceState.update(`userConfigs`, configObject);
        sendUserConfigs();
        sendRoutes();
        if (ext.watcher) {
            console.log('reset watcher');
            stopWatch();
            startWatch();
        }
        // wip, will move into own func later
        ext.treeView = undefined;
        ext.treeView = new ReverbTreeProvider(workspace.rootPath || '', ext.workspaceObj());
        ext.treeView.tree = window.createTreeView('paths', {
            treeDataProvider: ext.treeView,
        });
        ext.treeView.tree.onDidChangeSelection((e: { selection: { label: string }[] }) => {
            const uri = utils.convert(e.selection[0].label);
            commands.executeCommand('extension.openFileInEditor', uri);
        });
    }

    /**
     * Sets preset for endpoint and returns presets object to webview
     * @param {string} preset preset object to be stored
     */
    export function savePreset(preset: any) {
        const data = ext.presetsObject();
        if (data === undefined) {
            ext.context.workspaceState.update(`presets`, {});
        }
        if (data![preset.url] === undefined) {
            data![preset.url] = [];
        }
        data![preset.url].push(preset);
        ext.context.workspaceState.update(`presets`, data);
        ReverbPanel.currentPanel?.send({
            command: 'presetsObject',
            data,
        });
    }

    /**
     * Deletes preset on endpoint and returns updated presets object to webview
     * @param {string} preset preset object to be deleted
     */
    export function deletePreset(preset: any) {
        const data = ext.presetsObject();
        if (data === undefined) return;

        if (data[preset.url]) {
            delete data[
                data[preset.url].findIndex((el) => {
                    return el.name === preset.name;
                })
            ];
        }
        ext.context.workspaceState.update(`presets`, data);
        ReverbPanel.currentPanel?.send({
            command: 'presetsObject',
            data,
        });
    }

    /**
     * Opens provided file in editor
     * @param {string} uri uri of file to be opened.
     */
    export async function openFileInEditor(uri: string) {
        const _workspaceObj = ext.workspaceObj();

        await commands.executeCommand('workbench.action.focusAboveGroup');
        Object.keys(_workspaceObj!).forEach((el) => {
            if (_workspaceObj![el][uri.slice(7)]) {
                const path = Uri.joinPath(workspace.workspaceFolders![0].uri, el);

                workspace
                    .openTextDocument(path)
                    .then((document) => window.showTextDocument(document, ViewColumn.Active));
            }
        });
    }

    /**
     * Deletes all stored info
     */
    export function deleteRoutesObject() {
        ext.context.workspaceState.update(`obj`, {});
        ext.context.workspaceState.update(`userConfigs`, undefined);
        ext.context.workspaceState.update(`presets`, {});

        sendUserConfigs();
        sendRoutes();
        sendPreset();
    }

    /**
     * Closes reVerb webview and opens VSC terminal
     */
    export async function OpenTerminal() {
        await commands.executeCommand('workbench.action.closeEditorsInGroup');
        await commands.executeCommand('workbench.action.terminal.new');
    }

    /**
     * Ensures server running on selected port.
     * @param {string} port server port.
     * @returns {undefined | string} undefined if server running. String if no server running.
     */
    export function validatePort(port: number) {
        return find('port', port).then(function (list) {
            const data = !!list.length;
            ReverbPanel.currentPanel?.send({
                command: 'validPort',
                data,
            });
        });
    }

    /**
     * Opens reVerb webview in editor
     */
    export async function OpenWebview() {
        await utils.clearEditorPanels();

        ReverbPanel.createOrShow(ext.context.extensionUri);
        await commands.executeCommand('workbench.action.closeEditorsToTheLeft');
        sendRoutes();

        setTimeout(function () {
            commands.executeCommand('workbench.action.webview.openDeveloperTools');
        }, 1500);
    }

    /**
     * Sends msg to webview to get server path and port
     */
    export async function initWebviewForm() {
        const rootDir = workspace.workspaceFolders![0].name;
        if (!ReverbPanel.currentPanel) await OpenWebview();

        ReverbPanel.currentPanel?.send({
            command: 'getServerInfo',
            portFiles,
            rootDir,
        });
        return 'sent';
    }

    /**
     * Generates Axios req snippet based on selected tree item and copies to clipboard
     */
    export async function GenerateAxios(node: any) {
        const snippet = utils.generateSnippet(utils.convert(node.label));
        await env.clipboard.writeText(snippet);
        window.showInformationMessage(`Axios Request snippet added to clipboard`);
    }
}
