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
import { possibleServerFilePaths } from './parser/utils/serverPath';
import ExpressParser from './parser/expressParser';

export namespace ExtCmds {
    /**
     * Takes config and makes axios request returning detailed response
     * @param {any} query Config option object of request.
     * @returns {any}  Response of the request made.
     */
    export async function verboseRequest(query: any) {
        const masterObject = ext.workspaceObj();

        query.baseURL = masterObject!.urls[query.baseURL].url;
        const data = await utils.ping(query);
        console.log(data);
        return data;
    }

    /**
     * Sends routes object to webview or prompts for server info if no routes exist in storage
     */
    export function dataObjects() {
        const rootDirectory = workspace.workspaceFolders![0].name;

        let masterObject = ext.workspaceObj();
        if (masterObject === undefined)
            masterObject = {
                paths: {},
                urls: {},
                presets: {},
            };

        const data = {
            masterObject,
            possibleServerFilePaths,
            rootDirectory,
        };

        return data;
    }

    /**
     * Parses files with supplied port and server file
     * @param {string} data object with port and serverFile
     */
    export function parseServer(data: any) {
        const expressParser = new ExpressParser(data.file_path, data.port);
        const parseOutput = expressParser.parse();
        const { paths, urls, presets } = ext.workspaceObj()!;

        const currentMasterObject = {
            paths: {
                ...paths,
                ...parseOutput.paths,
            },
            urls: {
                ...urls,
                ...parseOutput.urls,
            },
            presets: {
                ...presets,
                ...parseOutput.presets,
            },
        };

        ext.context.workspaceState.update(`obj`, currentMasterObject);
        utils.resetTreeview();
        return ext.workspaceObj();
    }

    /**
     * Sets preset for endpoint and returns presets object to webview
     * @param {string} preset preset object to be stored
     */
    export function savePreset(preset: any) {
        const _data = ext.workspaceObj();
        const uuid = uuidv4();
        preset.id = uuid;
        _data!.urls[preset.urlState].presets.push(uuid);
        _data!.presets[uuid] = preset;
        ext.context.workspaceState.update(`obj`, _data);
        return { data: ext.workspaceObj(), preset: preset.id };
    }

    /**
     * Deletes preset on endpoint and returns updated presets object to webview
     * @param {string} preset preset object to be deleted
     */
    export function deletePreset(preset: any) {
        const _data = ext.workspaceObj();
        const temp = _data!.presets[preset].urlState;
        _data!.urls[temp].presets = _data!.urls[temp].presets.filter(
            (item: any) => !preset.includes(item),
        );
        ext.context.workspaceState.update(`obj`, _data);
        return ext.workspaceObj();
    }

    /**
     * Opens provided file in editor
     * @param {string} uri uri of file to be opened.
     */
    export async function openFileInEditor(uri: string) {
        workspace
            .openTextDocument(uri)
            .then((document) => window.showTextDocument(document, ViewColumn.One));
    }

    /**
     * Deletes all stored info
     */
    export function wipeStorageObject() {
        ext.context.workspaceState.update(`obj`, {
            paths: {},
            urls: {},
            presets: {},
        });
        utils.resetTreeview();
        return ext.workspaceObj();
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

        setTimeout(function () {
            commands.executeCommand('workbench.action.webview.openDeveloperTools');
        }, 1500);
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
