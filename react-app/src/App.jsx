/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch } from "react-redux";
import Main from "./containers/Main";
import Output from "./containers/Output";
import { sendConfig } from "../redux/reducers/configsSlice";
import { setVsState } from "../redux/reducers/routesSlice";

function App({ data, res }) {
  const dispatch = useDispatch();

  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
      case "data":
        dispatch(setVsState(data));
        break;
      case "config":
        dispatch(sendConfig(res));
        break;
      default:
    }
  });

  return (
    <div className="grid-container">
      <Output />
      <Main />
    </div>
  );
}

export default App;
