import { window, ExtensionContext } from 'vscode';
import { getLocalPath } from '../parser/utils/genericFileOps';

/**
 * Updates endpoint config based on user input
 * @param {ExtensionContext} context context provided by vscode during activation
 */
export async function configEndpoint(context: ExtensionContext) {
  const activeEditor = window.activeTextEditor;
  if (!activeEditor) return;

  const path = getLocalPath(activeEditor.document.uri.path);
  const line = activeEditor.selection.active.line + 1;

  // uncomment to simulate input that would come from webview/electron input
  const data: Partial<options> = {
    // method: 'PUT',
    // headers: {},
    // data: {},
  };

  /**
   * Attempts to get state and calls parser if it is undefined.
   */
  async function getState() {
    // Search vscode workspace storage for key that matches file path of selected endpoint
    const workspaceObj:
      | WorkspaceObj
      | undefined = await context.workspaceState.get(`obj`);

    if (workspaceObj === undefined) {
      console.log('No state obj');
      return;
    }
    findRouterMatch(workspaceObj);
  }

  /**
   * Finds matching endpoint in state and updates config.
   * @param {WorkspaceObj} workspaceObj Main state object.
   */
  async function findRouterMatch(workspaceObj: WorkspaceObj) {
    const routerFileObj = workspaceObj[path];
    if (routerFileObj === undefined) {
      console.log('No routerFile obj');
      return;
    }
    for (const type in routerFileObj) {
      for (const key in routerFileObj[type]) {
        if (
          line >= routerFileObj[type][key].range[0]
          && line <= routerFileObj[type][key].range[1]
        ) {
          const newConfig = Object.assign(
            routerFileObj[type][key].config,
            data,
          );
          workspaceObj[path][type][key].config = newConfig;
          await context.workspaceState.update(`obj`, workspaceObj);
          console.log('Config updated');
        }
      }
    }
  }

  // Init
  getState();
}
