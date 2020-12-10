/**
 * ************************************
 *
 * @module  ReverbPanel.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Defines the ReverbPanel webview class.
 *
 * ************************************
 */

import { window, WebviewPanel, ViewColumn, commands, Uri, Disposable } from 'vscode';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ext } from '../extensionVariables';

export default class ReverbPanel {
    public static currentPanel: ReverbPanel | undefined;

    public static readonly viewType = 'main';

    private readonly _panel: WebviewPanel;

    private readonly _extensionUri: Uri;

    private _disposables: Disposable[] = [];

    public static createOrShow(extensionUri: Uri) {
        // If we already have a panel, show it.
        if (ReverbPanel.currentPanel) {
            ReverbPanel.currentPanel._panel.reveal(ViewColumn.Active);
            return;
        }

        // Otherwise, create a new panel.
        const panel = window.createWebviewPanel(ReverbPanel.viewType, 'reVerb', ViewColumn.Active, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [Uri.file(path.join(ext.context.extensionPath, 'out'))],
        });

        ReverbPanel.currentPanel = new ReverbPanel(panel, extensionUri);
    }

    public static revive(panel: WebviewPanel, extensionUri: Uri) {
        ReverbPanel.currentPanel = new ReverbPanel(panel, extensionUri);
    }

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), undefined, this._disposables);

        // Update the content based on view changes
        // this._panel.onDidChangeViewState(
        //     (e) => {
        //         if (this._panel.visible) {
        //             this._update();
        //         }
        //     },
        //     undefined,
        //     this._disposables,
        // );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            async (msg: Msg) => {
                switch (msg.command) {
                    case 'get-data':
                        commands.executeCommand('extension.sendRoutes');
                        commands.executeCommand('extension.sendPreset');
                        commands.executeCommand('extension.sendUserConfigs');
                        break;
                    case 'startWatch':
                        commands.executeCommand('extension.startWatch');
                        break;
                    case 'stopWatch':
                        commands.executeCommand('extension.stopWatch');
                        break;
                    case 'verboseRequest':
                        commands.executeCommand('extension.verboseRequest', msg.data);
                        break;
                    case 'openTerminal':
                        commands.executeCommand('extension.openTerminal');
                        break;
                    case 'parseServer':
                        commands.executeCommand('extension.parseServer', msg.data);
                        break;
                    case 'validatePort':
                        commands.executeCommand('extension.validatePort', msg.data);
                        break;
                    case 'savePreset':
                        commands.executeCommand('extension.savePreset', msg.data);
                        break;
                    case 'deletePreset':
                        commands.executeCommand('extension.deletePreset', msg.data);
                        break;
                    case 'userInputPrompt':
                        commands.executeCommand('extension.initWebviewForm');
                        break;
                    case 'deleteRoutesObject':
                        commands.executeCommand('extension.deleteRoutesObject').then((el) => {
                            return el;
                        });
                        break;
                    case 'openFileInEditor':
                        await commands.executeCommand('extension.openFileInEditor', msg.data);
                        break;
                    default:
                }
            },
            undefined,
            this._disposables,
        );
        const htmlPath = path.join(ext.context.extensionPath, 'out/index.html');
        this._panel.webview.html = readFileSync(htmlPath).toString();
    }

    public send(data: any) {
        this._panel.webview.postMessage(data);
    }

    public dispose() {
        ReverbPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();
        ext.watcher?.dis1?.dispose();
        ext.watcher?.dis2?.dispose();
        ext.watcher = undefined;

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

type Msg = Record<string, unknown>;
