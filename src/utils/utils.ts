/**
 * ************************************
 *
 * @module  utils.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Various helper functions
 *
 * ************************************
 */

import { window, commands, workspace } from 'vscode';
import axios, { AxiosResponse } from 'axios';
import { ext } from '../extensionVariables';
import ReverbTreeProvider from '../modules/reverbTreeProvider';

const { performance } = require('perf_hooks');

const HTTPSnippet = require('httpsnippet');

export function generateSnippet(data: any) {
    let text = new HTTPSnippet(data);
    text = text.convert('javascript', 'axios');
    const lines = text.split('\n');
    lines.splice(0, 2);
    const snippet = lines.join('\n');
    return snippet;
}

/**
 * Takes config and makes axios request
 * @param {AxiosRequestConfig | Options} Options Config option object of request.
 * @returns {AxiosResponse<any>} Response of the request made.
 */
export function ping(options: { url: any; method: any }) {
    const config = { ...options, validateStatus: undefined };
    const time = performance.now();
    return axios
        .request(config)
        .then(function (res: AxiosResponse) {
            const resTime = (performance.now() - time).toFixed(1);
            return {
                status: res.status,
                resTime,
                headers: res.headers,
                config: res.config,
                data: res.data,
            };
        })
        .catch(function (error) {
            const resTime = (performance.now() - time).toFixed(1);
            return {
                status: error.code,
                resTime,
                headers: error.config.headers,
                config: error.config,
                data: error.message,
            };
        });
}

export function resetTreeview() {
    ext.treeView = undefined;
    ext.treeView = new ReverbTreeProvider(
        workspace.rootPath || '',
        ext.context.workspaceState.get(`masterDataObject`),
    );
    ext.treeView.tree = window.createTreeView('paths', {
        treeDataProvider: ext.treeView,
    });

    ext.treeView.tree.onDidChangeSelection(async (e: any) => {
        if (e.selection[0].contextValue === 'routeItem') {
            console.log(e.selection[0]);
            commands.executeCommand(
                'extension.openFileInEditor',
                e.selection[0].filePath,
                e.selection[0].range,
            );
        }
    });
}

/**
 * Clears away all panels so that webview can be in proper position
 */
export async function clearEditorPanels() {
    const x = window.activeTextEditor;
    await commands.executeCommand('workbench.action.focusBelowGroup');
    let y = window.activeTextEditor;
    while (x !== y) {
        await commands.executeCommand('workbench.action.closeEditorsInGroup');
        await commands.executeCommand('workbench.action.focusBelowGroup');
        y = window.activeTextEditor;
    }

    const cmds = [
        'workbench.action.closePanel',
        'workbench.action.splitEditorDown',
        'workbench.action.decreaseViewHeight',
        'workbench.action.decreaseViewHeight',
    ];

    for (const cmd of cmds) await commands.executeCommand(cmd);
}
