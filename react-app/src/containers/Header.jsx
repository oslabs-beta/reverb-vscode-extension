import React from "react";
import { useSelector } from "react-redux";
import { routes } from "../../redux/reducers/routesSlice";
import Select from "../components/Select";

function Header() {
  const data = useSelector(routes);
  console.log("header.jsx => Header => routes:", data);

  const routesArr = [];
  if (data) {
    Object.keys(data).forEach((key) => {
      Object.keys(data[key]).forEach((subkey) => {
        routesArr.push(
          <option key={subkey} value={subkey}>
            {subkey}
          </option>,
        );
      });
    });
  }

  return (
    <div className="container__header">
      <div className="header">
        <div className="group__left">
          <Select routes={routesArr} />
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
