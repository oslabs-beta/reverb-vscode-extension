import { window, ExtensionContext } from 'vscode';
import ExpressParser from '../parser/expressParser';
import { multiStepInput } from './multiStepInput';
import * as utils from './utils';

export async function configEndpoint(context: ExtensionContext) {
  const activeEditor = window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  const path = activeEditor.document.uri.path;
  const line = activeEditor.selection.active.line + 1;
  const data: Partial<options> = {
    method: 'PUT',
    headers: {},
    data: {},
  };
  getState();

  async function getState() {
    // Search vscode workspace storage for key that matches file path of selected endpoint
    const workspaceObj:
      | WorkspaceObj
      | undefined = await context.workspaceState.get(`obj`);

    if (workspaceObj === undefined) {
      console.log('No state obj');
      return;
    }
    const changed = await findRouterMatch(workspaceObj);
    if (!changed) return;
    workspaceObj[path] = changed;
    await context.workspaceState.update(`obj`, workspaceObj);
    console.log('Config updated');
  }

  async function findRouterMatch(workspaceObj: WorkspaceObj) {
    const routerFileObj = workspaceObj[path];
    if (routerFileObj === undefined) {
      console.log('No routerFile obj');
      return;
    }
    for (const key in routerFileObj) {
      if (
        line >= routerFileObj[key].range[0]
        && line <= routerFileObj[key].range[1]
      ) {
        const newConfig = Object.assign(routerFileObj[key].config, data);
        routerFileObj[key].config = newConfig;
        return routerFileObj;
      }
    }
  }
}
