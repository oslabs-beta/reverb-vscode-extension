import React from "react";
import Select from "../components/Select";

function Header({ routesArr, axiosReq }) {
  return (
    <div className="container__header">
      <div className="header">
        <div className="group__left">
          <Select
            axiosReq={axiosReq}
            routesArr={routesArr}
            group="group__left"
          />
        </div>
        <div className="group__right">
          <Select />
        </div>
      </div>
    </div>
  );
}

export default Header;
