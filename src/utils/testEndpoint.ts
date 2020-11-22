///* eslint-disable @typescript-eslint/no-unused-vars */
//import { window, ExtensionContext } from 'vscode';
//import ExpressParser from '../parser/expressParser';
//import { multiStepInput } from './multiStepInput';
//import * as utils from './utils';
//
//export async function testEndpoint(context: ExtensionContext) {
//  const activeEditor = window.activeTextEditor;
//  if (!activeEditor) {
//    return;
//  }
//  const path = activeEditor.document.uri.path;
//  const line = activeEditor.selection.active.line + 1;
//
//  getState();
//
//  async function getState() {
//    // Search vscode workspace storage for key that matches file path of selected endpoint
//    const workspaceObj:
//      | WorkspaceObj
//      | undefined = await context.workspaceState.get(`obj`);
//
//    if (workspaceObj === undefined) {
//      console.log('No state obj. Reparsing');
//      parseAndUpdate();
//      return;
//    }
//    findRouterMatch(workspaceObj);
//  }
//
//  async function findRouterMatch(workspaceObj: WorkspaceObj) {
//    const routerFileObj = workspaceObj[path];
//    if (routerFileObj === undefined) {
//      console.log('No routerFile obj. Reparsing');
//      parseAndUpdate();
//      return;
//    }
//    // Router file found => check if selected line is associated with known endpoint in file
//    routerFileObj.forEach((endPoint: EndPoint) => {
//      if (line >= endPoint.range[0] && line <= endPoint.range[1]) {
//        queryEndpoint(endPoint);
//      }
//      return;
//    });
//  }
//
//  async function queryEndpoint(endPoint: EndPoint) {
//    await utils
//      .ping(
//        endPoint.method,
//        `http://localhost:${endPoint.port}${endPoint.endPoint}`,
//      )
//      .then((res) => {
//        // is we get response, add decorative inline text of status and statusCode
//        utils.addDeco(
//          `${res.status} : ${res.statusText}`,
//          endPoint.range[0] - 1,
//          activeEditor!.document.lineAt(endPoint.range[0] - 1).range.end
//            .character + 5,
//          activeEditor!,
//        );
//      })
//      .catch((err) => {
//        utils.addDeco(
//          `500 NO RESPONSE`,
//          endPoint.range[0] - 1,
//          activeEditor!.document.lineAt(endPoint.range[0] - 1).range.end
//            .character + 5,
//          activeEditor!,
//        );
//      });
//  }
//
//  async function parseAndUpdate() {
//    const userInput = await multiStepInput(context);
//    const expressParser = new ExpressParser(
//      userInput.serverPath,
//      parseInt(userInput.port),
//    );
//    const data = await expressParser.parse();
//    await context.workspaceState.update(`obj`, data);
//    testEndpoint(context);
//  }
//}
