import React, { useState, useEffect } from "react";
import create from "../Interaction/InteractorApi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Input from "./Input";

function Main() {
  const [vscodeState, setVscodeState] = useState();
  const [api, setApi] = useState();

  function tryAcquireVsCodeApi() {
    try {
      return acquireVsCodeApi();
    } catch {
      return null;
    }
  }
  const set = tryAcquireVsCodeApi();
  setApi(set);
  const Interactor = create(api);

  console.log(api);

  window.addEventListener("message", (event) => {
    const { command, state } = event.data;

    switch (command) {
      case "giveState":
        setVscodeState(state);
        break;
      default:
    }
  });

  useEffect(() => {
    Interactor.getStateFromVscode();
  }, []);

  if (vscodeState === undefined) return <p>Loading...</p>;

  function axiosReq({ type, route }) {
    const [key, subkey] = route.split(",");
    const { config } = vscodeState[key][subkey][type];
    Interactor.axiosReq(config);
  }

  const routes = [];
  Object.keys(vscodeState).forEach((key) => {
    Object.keys(vscodeState[key]).forEach((subkey) => {
      const vals = [key, subkey];
      routes.push(
        <option key={subkey} value={vals}>
          {subkey}
        </option>,
      );
    });
  });

  return (
    <div className="container__main">
      <Header routes={routes} axiosReq={axiosReq} />
      <Input />
      <Sidebar />
    </div>
  );
}

export default Main;
