/**
 * ************************************
 *
 * @module  Decorator.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Defines Decorator class. Decorator writes decoration text in editor.
 *
 * ************************************
 */

/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import {
    TextEditor,
    Range,
    DecorationOptions,
    Position,
    window,
    TextEditorDecorationType,
} from 'vscode';
import axios from 'axios';
import { ext } from '../extensionVariables';
import ReverbPanel from '../webview/ReverbPanel';

export default class Decorator {
    decorationType: TextEditorDecorationType | undefined = undefined;

    async addDecorations(editor: TextEditor, toDecorate: FullPath[] | undefined) {
        try {
            const decorations: DecorationOptions[] = [];
            const routes = await this.queryAll(editor, toDecorate!);
            if (routes === undefined) return;
            const data = routes;

            ReverbPanel.currentPanel?.send({
                command: 'watchOutput',
                data,
            });

            const _decorations = routes.reduce((acc: DecorationOptions[], el: Output) => {
                return acc.concat({
                    renderOptions: {
                        before: { contentText: el.content, color: el.error ? 'red' : 'green' },
                    },
                    range: new Range(
                        new Position(el.line, el.column),
                        new Position(el.line, el.column),
                    ),
                });
            }, []);
            _decorations.forEach((d: DecorationOptions) => decorations.push(d));

            editor.setDecorations(ext.decorator.decorationType!, decorations);
        } catch (error) {
            return error;
        }
    }

    async queryAll(editor: TextEditor, routes: FullPath[]) {
        if (routes === undefined) return;

        try {
            const output: Output[] = [];
            await Promise.allSettled(
                routes.map((obj) =>
                    axios
                        .request(obj.config)
                        .then((res) => {
                            console.log(res);
                            output.push({
                                url: res.config.url,
                                status: res.status,
                                method: res.config.method?.toUpperCase(),
                                content: `${res.status} : ${res.statusText}`,
                                line: obj.range[0] - 1,
                                column:
                                    editor.document.lineAt(obj.range[0] - 1).range.end.character +
                                    5,
                                error: false,
                            });
                        })
                        .catch((error) => {
                            output.push({
                                data: JSON.stringify(error),
                                content: error.name,
                                line: obj.range[0] - 1,
                                column:
                                    editor.document.lineAt(obj.range[0] - 1).range.end.character +
                                    5,
                                error: true,
                            });
                        }),
                ),
            );
            return output;
        } catch (error) {
            return `Error in Watcher.queryAll:${error}`;
        }
    }

    initDecorator() {
        this.decorationType = window.createTextEditorDecorationType({});
    }
}

interface Output {
    url?: string;
    status?: number;
    method?: string;
    data?: any;
    content?: string;
    line: number;
    column: number;
    error: boolean;
}
