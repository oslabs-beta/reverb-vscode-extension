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

import { ExtensionContext, commands } from 'vscode';
import ReverbTreeProvider from './modules/reverbTreeProvider';
import Decorator from './modules/Decorator';

import * as utils from './utils/utils';

export namespace ext {
    export let context: ExtensionContext;
    export let treeView: ReverbTreeProvider | undefined;
    export let decoration: Decorator;

    export const setContext = <T>(ctx: string, value: T) =>
        commands.executeCommand('setContext', ctx, value);
    export const registerCommand = (
        command: string,
        callback: (...args: any[]) => any,
        thisArg?: any,
    ) => context.subscriptions.push(commands.registerCommand(command, callback, thisArg));
}

export function initializeExtensionVariables(ctx: ExtensionContext) {
    ext.context = ctx;

    if (!ext.treeView) utils.resetTreeview();

    ext.decoration = new Decorator();
}
