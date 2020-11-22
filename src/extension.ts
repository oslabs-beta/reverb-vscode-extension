import * as vscode from 'vscode';
import * as serverTypes from './constants/serverTypes';
import ExpressParser from './parser/expressParser';
const CONFIG = require('../reverbconfig.json');

// runs on extension startup
export function activate(context: vscode.ExtensionContext) {
  let serverParser;

  // Activate the appropriate parser for the server type
  switch (CONFIG.serverType) {
    case serverTypes.EXPRESS:
      console.log('Parsing Express server');
      serverParser = new ExpressParser(CONFIG.serverPath, CONFIG.portNumber);
      const ENDPOINTS = serverParser.parse();
      console.log(ENDPOINTS);
      break;
    case serverTypes.NODE:
      console.log('NODE support coming soon');
      break;
    default:
      console.log(
        'ERROR: Unsupported server type specified in reverbconfig.json',
      );
  }
}

export function deactivate() {
  return;
}
