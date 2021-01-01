/**
 * ************************************
 *
 * @module  Decorator.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/24/2020
 * @description Defines Decorator class. Decorator writes decoration text in editor.
 *
 * ************************************
 */
import { Range, DecorationOptions, Position, window, TextEditorDecorationType } from 'vscode';
import * as path from 'path';

export default class Decorator {
    private static readonly highlightDecorationType: TextEditorDecorationType = window.createTextEditorDecorationType(
        {
            backgroundColor: 'rgba(112, 149, 255, 0.15)',
            gutterIconPath: path.join(__filename, '..', '..', 'resources', 'dark', 'gutter.svg'),
        },
    );

    private decoration: DecorationOptions[];

    public highlightDeco(range: number[], text: string | undefined): void {
        const editor = window.activeTextEditor;
        if (editor === undefined) return;
        this.decoration = [];

        let end = editor.document.lineAt(range[1] - 1).text.length;

        this.decoration.push({
            range: new Range(new Position(range[0] - 1, 0), new Position(range[1] - 1, end)),
        });

        if (text !== undefined) {
            end = editor.document.lineAt(range[0] - 1).text.length;
            this.decoration.push({
                renderOptions: {
                    after: { contentText: text, margin: '20px', color: 'rgba(112, 149, 255)' },
                },
                range: new Range(new Position(range[0] - 1, end), new Position(range[0] - 1, end)),
            });
        }

        editor.setDecorations(Decorator.highlightDecorationType, this.decoration);
    }

    public constructor() {
        this.decoration = [];
    }
}
