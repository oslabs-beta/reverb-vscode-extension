/* eslint-disable no-unused-vars */
import Interactor from "./Interactor";

const VsCodeStateChangeCallbacks = {
  getDirectoryInfo: (_directoryInfo) => {},
};

const VsCodeStateChangeBuffer = {
  directoryInfo: "",
};

window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.command) {
    case "getDirectoryInfo":
      VsCodeStateChangeBuffer.directoryInfo += message.directoryInfo;
      VsCodeStateChangeCallbacks.getDirectoryInfo(
        VsCodeStateChangeBuffer.directoryInfo,
      );
      break;
    default:
  }
});

function createFromVsCodeApi(vscode) {
  Interactor.showInformationMessage = (text) =>
    vscode.postMessage({
      command: "showInformationMessage",
      text,
    });

  Interactor.getDirectoryInfo = (callback) => {
    VsCodeStateChangeCallbacks.getDirectoryInfo = callback;
    VsCodeStateChangeBuffer.directoryInfo = "";
    vscode.postMessage({ command: "getDirectoryInfo" });
  };

  return Interactor;
}

const VsCodeInteractorFactory = {
  createFromVsCodeApi: (vscode) => createFromVsCodeApi(vscode),
};

export default VsCodeInteractorFactory;
