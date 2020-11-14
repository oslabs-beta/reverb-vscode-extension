
import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "reverb-vs-code-extension" is now active!');

	let disposable = vscode.commands.registerCommand('reverb-vs-code-extension.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from reVerb VS Code extension!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
