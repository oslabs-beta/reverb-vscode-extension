/* eslint-disable consistent-return */
/* eslint-disable guard-for-in */
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

import { workspace, commands, window, ViewColumn, env } from 'vscode';
import find from 'find-process';
import { v4 as uuidv4 } from 'uuid';
import { ext } from './extensionVariables';
import * as utils from './utils/utils';
import ReverbPanel from './webview/ReverbPanel';
import getServerPaths from './parser/utils/serverPath';
import ExpressParser from './parser/expressParser';

export namespace ExtCmds {
    export let _data: MasterDataObject | undefined;

    /**
     * Takes config and makes axios request returning detailed response
     * @param {any} query Config option object of request.
     * @returns {any} Response of the request made.
     */
    export async function verboseRequest(query: any) {
        const data = await utils.ping(query);
        return data;
    }

    /**
     * Sends routes object to webview or prompts for server info if no routes exist in storage
     */
    export function dataObjects() {
        _data = ext.context.workspaceState.get(`masterDataObject`);
        if (!_data) {
            return {
                serverPaths: getServerPaths(),
                rootDirectory: workspace.workspaceFolders![0].name,
            };
        }
        return _data;
    }

    /**
     * Parses files with supplied port and server file
     * @param {string} data object with port and serverFile
     */
    export function parseServer(serverInfo: { file_path: string; port: number }) {
        const expressParser = new ExpressParser(serverInfo.file_path, serverInfo.port);
        const parsed = expressParser.parse();

        _data = ext.context.workspaceState.get(`masterDataObject`);
        if (_data === undefined)
            _data = {
                domains: {},
                index: {},
                serverPaths: getServerPaths(),
                rootDirectory: workspace.workspaceFolders![0].name,
            };

        _data.domains[serverInfo.file_path] = { urls: parsed.urls, paths: parsed.paths };
        _data.index = { ..._data.index, ...parsed.index };

        ext.context.workspaceState.update(`masterDataObject`, _data);
        utils.resetTreeview();
        return _data;
    }

    /**
     * Sets preset for endpoint and returns presets object to webview
     * @param {string} preset preset object to be stored
     */
    export function savePreset(preset: any) {
        _data = ext.context.workspaceState.get(`masterDataObject`);
        if (_data === undefined) return;

        const { serverPath, href } = preset.urlState;
        const uuid = uuidv4();
        preset.id = uuid;

        _data.domains[serverPath].urls[href].presets[uuid] = preset;
        ext.context.workspaceState.update(`masterDataObject`, _data);
        return { data: _data, preset };
    }

    /**
     * Deletes preset on endpoint and returns updated presets object to webview
     * @param {string} preset preset object to be deleted
     */
    export function deletePreset(preset: any) {
        _data = ext.context.workspaceState.get(`masterDataObject`);
        if (_data === undefined) return;

        const { serverPath, href } = preset.urlState;
        delete _data.domains[serverPath].urls[href].presets[preset.id];
        ext.context.workspaceState.update(`masterDataObject`, _data);
        return _data;
    }

    /**
     * Opens provided file in editor
     * @param {string} uri uri of file to be opened.
     */
    export async function openFileInEditor(uri: string, range: any) {
        workspace
            .openTextDocument(uri)
            .then((document) => window.showTextDocument(document, ViewColumn.One))
            .then(() => {
                if (range !== undefined) {
                    ext.decoration.highlightDeco(range, undefined);
                }
            });
    }

    /**
     * Deletes all stored info
     */
    export function wipeStorageObject() {
        ext.context.workspaceState.update(`masterDataObject`, undefined);
        utils.resetTreeview();
        return undefined;
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
            return data;
        });
    }

    /**
     * Opens reVerb webview in editor
     */
    export async function OpenWebview() {
        await utils.clearEditorPanels();
        ReverbPanel.createOrShow(ext.context.extensionUri);
        await commands.executeCommand('workbench.action.closeEditorsToTheLeft');
    }

    /**
     * Generates Axios req snippet based on selected tree item and copies to clipboard
     */
    export async function GenerateAxios(endpoint: any) {
        const snippet = utils.generateSnippet({ method: endpoint.method, url: endpoint.uri });
        await env.clipboard.writeText(snippet);
        window.showInformationMessage(`Axios Request snippet added to clipboard`);
    }

    /**
     * Initiate query from content menu click on specific endpoint function
     */
    export async function rightClickQuery(label: { path: any }) {
        _data = ext.context.workspaceState.get(`masterDataObject`);
        if (window.activeTextEditor === undefined) return;
        if (_data === undefined) return;

        let { path } = label;
        if (path[2] === ':') path = path.slice(1);

        const line = window.activeTextEditor.selection.active.line + 1;
        const { serverPath } = _data.index[path];

        const ranges = _data.domains[serverPath].paths[path];
        let range: number[];
        let config;

        for (const _range in ranges) {
            const split = _range.split('-');

            if (
                line >= Number.parseInt(split[0], 10) &&
                line <= Number.parseInt(split[1] || split[0], 10)
            ) {
                range = [
                    Number.parseInt(split[0], 10),
                    Number.parseInt(split[1], 10) || Number.parseInt(split[0], 10),
                ];
                config = {
                    url: ranges[_range].origin.concat(ranges[_range].pathname),
                    method: ranges[_range].method,
                };
            }
        }
        if (config === undefined) return;
        const res = await utils.ping(config);
        const text = `-=:> ${res.resTime}ms | status: ${res.status} | data: ${JSON.stringify(
            res.data,
        )}`;
        ext.decoration.highlightDeco(range!, text);
    }

    /**
     * Querys single endpoint with minimal options
     */
    export async function simpleQuery(routeItem: { uri: any; method: any; range: number[] }) {
        const config = {
            url: routeItem.uri,
            method: routeItem.method,
        };
        const data = await utils.ping(config);
        const text = `-=:> ${data.resTime}ms | status: ${data.status} | data: ${JSON.stringify(
            data.data,
        )}`;
        ext.decoration.highlightDeco(routeItem.range, text);
    }
}
