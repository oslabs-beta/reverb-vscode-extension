import React from "react";
import Select from "../components/Select";

function Header({ routesArr, axiosReq }) {
  console.log(routesArr, "i");
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
          <select name="route" className="select__endpoint">
            test
          </select>
          <button type="button" className="button__add">
            +
          </button>
          <button type="button" className="button__save">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
