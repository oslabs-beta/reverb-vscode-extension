import * as vscode from 'vscode';
import ServerParser from './parser/serverParser';

const CONFIG = require('../reverbconfig.json');

export function activate(context: vscode.ExtensionContext) {
	
	// Parse server to find endpoints
	const serverParser = new ServerParser(CONFIG);
	serverParser.parse();

	console.log('Congratulations, your extension "reverb-vs-code-extension" is now active!');

	const disposable = vscode.commands.registerCommand('reverb-vs-code-extension.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from reVerb VS Code extension!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
