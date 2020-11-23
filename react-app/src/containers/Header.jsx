import React from "react";

function Header() {
  return (
    <div className="container__header">
      <div className="header">
        <div className="group__left">
          <button type="button" className="button__type">
            GET
          </button>
          <input className="input__url" type="text" />
          <button type="button" className="button__send">
            Send
          </button>
        </div>
        <div className="group__right">
          <button type="button" className="button__presets">
            Presets
          </button>
          <input className="input__presets" type="text" />
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
