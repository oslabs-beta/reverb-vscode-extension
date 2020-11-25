/* eslint-disable no-undef */
const Interactor = {};

export default function create(vsCodeApi) {
  Interactor.getStateFromVscode = () => {
    vsCodeApi.postMessage({
      command: "getState",
    });
  };
  Interactor.axiosReq = (options) => {
    vsCodeApi.postMessage({
      command: "axiosReq",
      config: options,
    });
  };
  return Interactor;
}
