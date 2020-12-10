/**
 * ************************************
 *
 * @module  Watcher.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Defines Watcher class. Watcher sets listeners for file saves, focus change
 *              and any function can be run when these events trigger.
 *
 * ************************************
 */

/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import { window, TextEditor, workspace, Disposable, commands } from 'vscode';

import { ext } from '../extensionVariables';
import ExpressParser from '../parser/expressParser';

export default class Watcher {
    dis1: Disposable | undefined;

    dis2: Disposable | undefined;

    fullPathArray: FullPath[] | undefined;

    serverFile: FullPath['serverFile'] | undefined;

    port: FullPath['port'] | undefined;

    data: UserConfigObject | undefined = ext.userConfigObj();

    private getFullPathArray(editor: TextEditor) {
        let { path } = editor.document.uri;
        if (path[2] === ':') path = path.slice(1);
        this.fullPathArray = this.data![path];
    }

    private getServerFile(uri: string) {
        uri = uri.replace(/\\/g, '/');
        const { serverFile, port } = this.data![uri][0];
        this.serverFile = serverFile;
        this.port = port;
    }

    private parser(serverFile = this.serverFile, port = this.port) {
        const expressParser = new ExpressParser(serverFile!, port!);
        const obj = expressParser.parse();

        this.data = ext.userConfigObj();
        let wsObj = ext.workspaceObj();

        wsObj = { ...wsObj, ...obj[0] };
        this.data = { ...this.data, ...obj[1] };

        ext.context.workspaceState.update(`obj`, wsObj);
        ext.context.workspaceState.update(`userConfigs`, this.data);
        commands.executeCommand('extension.sendUserConfigs');
        commands.executeCommand('extension.sendRoutes');
    }

    initWatcher() {
        // Fires on switching between files
        this.dis1 = window.onDidChangeActiveTextEditor((e) => {
            if (this.data === undefined || e === undefined) {
                return;
            }

            this.getFullPathArray(e);
            ext.decorator.addDecorations(e, this.fullPathArray);
        });

        // Fires on save
        this.dis2 = workspace.onDidSaveTextDocument(async (e) => {
            if (this.data === undefined || e === undefined) {
                return;
            }

            this.getServerFile(e.uri.fsPath);
            this.parser();
            this.getFullPathArray(window.activeTextEditor!);
            // delay for time it takes nodemon to refresh server
            setTimeout(() => {
                ext.decorator.addDecorations(window.activeTextEditor!, this.fullPathArray);
            }, 1000);
        });

        // Fires on first load/activate
        if (window.activeTextEditor) {
            if (this.data === undefined) {
                return;
            }

            this.getFullPathArray(window.activeTextEditor);
            ext.decorator.addDecorations(window.activeTextEditor, this.fullPathArray);
        }

        return 'Watcher Init';
    }
}
