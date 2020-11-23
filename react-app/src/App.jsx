/* eslint-disable no-unused-vars */
import React from "react";
import Main from "./containers/Main";
import Output from "./containers/Output";
import InteractorFactory from "./Interaction/InteractorFactory";

function App() {
  //   const [userState, setUserState] = useState({
  //     isLoggedIn: false,
  //     login: "",
  //   });
  // updateFilesToDisplay() {
  //     Interactor.getDirectoryInfo(directoryInfo => {
  //       this.setState({ directoryInfo: directoryInfo });
  //     })
  //   }
  return (
    <div className="grid-container">
      <Output />
      <Main />
    </div>
  );
}

export default App;
