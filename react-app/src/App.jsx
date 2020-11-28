/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Main from "./containers/Main";
import Output from "./containers/Output";
import { setConfigs } from "../redux/reducers/configsSlice";
import { setRoutes } from "../redux/reducers/routesSlice";

function App() {
  const dispatch = useDispatch();

  window.addEventListener("message", (event) => {
    const message = event.data;

    switch (message.command) {
      case "data":
        if (message.data) {
          dispatch(setRoutes(message.data));
        } else {
          dispatch(setRoutes({}));
        }
        break;
      case "config":
        dispatch(setConfigs(message.out));
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
