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

import { window, commands } from 'vscode';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const { performance } = require('perf_hooks');

const HTTPSnippet = require('httpsnippet');

export function generateSnippet(data: any) {
    console.log(data, '!');
    let snippet = new HTTPSnippet(data);

    snippet = snippet.convert('javascript', 'axios');
    console.log(snippet, '!!');
    return snippet;
}

/**
 * Takes config and makes axios request
 * @param {AxiosRequestConfig | Options} Options Config option object of request.
 * @returns {AxiosResponse<any>} Response of the request made.
 */

// transformResponse: [function (data) {
//     // Do whatever you want to transform the data

//     return data;
//   }],
export function ping(Options: AxiosRequestConfig) {
    const config = { ...Options, validateStatus: undefined };
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

/**
 *
 * @param
 * @returns
 */
export function convert(route: string): any {
    let output = {
        method: '',
        url: '',
    };
    const METHOD_AND_URL = route.match(/(\S*):\s+(\S*)/);
    if (METHOD_AND_URL) {
        const method = METHOD_AND_URL[1];
        const url = 'http://'.concat(METHOD_AND_URL[2]);
        output = { method, url };
    }
    return output;
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
