import * as vscode from 'vscode';
import * as serverTypes from './constants/serverTypes';
import ExpressParser from './parser/expressParser';

const CONFIG = require('../reverbconfig.json');

export function activate(context: vscode.ExtensionContext) {
	let serverParser;

	// Activate the appropriate parser for the server type
	switch(CONFIG.serverType){
		case serverTypes.EXPRESS:
			console.log("Parsing Express server");
			serverParser = new ExpressParser(CONFIG.serverPath);
			serverParser.parse();
			break;
		case serverTypes.NODE:
			console.log("NODE support coming soon");
			break;
		default:
			console.log("ERROR: Unsupported server type specified in reverbconfig.json");
	}


	// Pre-existing code from initial creation of extention scaffolding
	console.log('Congratulations, your extension "reverb-vs-code-extension" is now active!');

	const disposable = vscode.commands.registerCommand('reverb-vs-code-extension.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from reVerb VS Code extension!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
