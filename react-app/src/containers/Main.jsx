import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Input from "./Input";

function Main() {
  return (
    <div className="container__main">
      <Header />
      <Input />
      <Sidebar />
    </div>
  );
}

export default Main;
