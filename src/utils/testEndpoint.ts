/* eslint-disable @typescript-eslint/no-unused-vars */
import { window, ExtensionContext, OutputChannel } from 'vscode';
import ExpressParser from '../parser/expressParser';
import { multiStepInput } from './multiStepInput';
import { getLocalPath } from '../parser/utils/genericFileOps';
import * as utils from './utils';

/**
 * Attempts to send request to endpoint with given config
 * @param {ExtensionContext} context context provided by vscode during activation
 * @param {OutputChannel} outputWindow reVerb output initialized in extension.ts
 */
export async function testEndpoint(
  context: ExtensionContext,
  outputWindow: OutputChannel,
) {
  const activeEditor = window.activeTextEditor;
  if (!activeEditor) return;

  // path file and selected line of user when executing command
  const path = getLocalPath(activeEditor.document.uri.path);
  const line = activeEditor.selection.active.line + 1;

  /**
   * Attempts to get state and calls parser if it is undefined.
   */
  async function getState() {
    // Search vscode workspace storage for key that matches file path of selected endpoint
    const workspaceObj:
      | WorkspaceObj
      | undefined = await context.workspaceState.get(`obj`);

    if (workspaceObj === undefined) {
      console.log('No state obj. Reparsing');
      parseAndUpdate();
      return;
    }
    findRouterMatch(workspaceObj);
  }

  /**
   * Finds matching endpoint in state
   * @param {WorkspaceObj} workspaceObj Main state object.
   */
  async function findRouterMatch(workspaceObj: WorkspaceObj) {
    console.log(path);
    const routerFileObj = workspaceObj[path];
    if (routerFileObj === undefined) {
      console.log('No routerFile obj. Reparsing');
      parseAndUpdate();
      return;
    }
    // Router file found => check if selected line is associated with known endpoint in file
    for (const type in routerFileObj) {
      for (const key in routerFileObj[type]) {
        if (
          line >= routerFileObj[type][key].range[0]
          && line <= routerFileObj[type][key].range[1]
        ) {
          queryEndpoint(routerFileObj[type][key]);
        }
      }
    }
    return;
  }

  /**
   * Initiates request to endpoint and calls to print response inline and in output window
   * @param {EndPoint} endPoint Object containing request data.
   */
  async function queryEndpoint(endPoint: EndPoint) {
    if (!activeEditor) return;
    const { method, url, headers, data } = endPoint.config;
    await utils
      .ping(endPoint.config)
      .then((res: { status: any; data: any; statusText: any }) => {
        // is we get response, add decorative inline text of status and statusCode
        if (!!res.status) {
          outputWindow.append(
            `[${new Date().toLocaleString('en-US', {
              hour12: false,
            })}] ${method} ${url} responded with status: ${
              res.status
            } \n${JSON.stringify(res.data, null, 2)} \n`,
          );
          utils.addDeco(
            `${res.status} : ${res.statusText}`,
            endPoint.range[0] - 1,
            activeEditor.document.lineAt(endPoint.range[0] - 1).range.end
              .character + 5,
            activeEditor,
          );
        } else {
          outputWindow.append(
            `[${new Date().toLocaleString('en-US', {
              hour12: false,
            })}] ${method} ${url} => ${res} \n`,
          );
          utils.addDeco(
            `ERROR`,
            endPoint.range[0] - 1,
            activeEditor.document.lineAt(endPoint.range[0] - 1).range.end
              .character + 5,
            activeEditor,
          );
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  /**
   * Gets user input and feeds to parser, then updates local state.
   */
  async function parseAndUpdate() {
    const { serverPath, port } = await multiStepInput(context);
    const expressParser = new ExpressParser(serverPath, parseInt(port));
    const data = await expressParser.parse();
    let state = await context.workspaceState.get(`obj`);

    // preserve existing state
    state = Object.assign({}, state, data);
    await context.workspaceState.update(`obj`, state);
  }

  // Init
  getState();
}
