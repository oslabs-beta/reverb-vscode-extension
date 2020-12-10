import { strictEqual } from 'assert';
import * as vscode from 'vscode';

describe('# trout sacc', () => {
    before(() => {
        vscode.window.showInformationMessage('Starting saccification');
    });

    it('one plus one equals two', () => {
        strictEqual(2, 1 + 1);
    });

    after(() => {
        vscode.window.showInformationMessage('Saccified!');
    });
});
