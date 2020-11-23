import React from "react";

function Sidebar() {
  return (
    <div className="container__sidebar">
      <div className="sidebar">
        <button type="button" className="button__body">
          Body
        </button>
        <button type="button" className="button__header">
          Header
        </button>
        <button type="button" className="button__params">
          Params
        </button>
        <button type="button" className="button__query">
          Query
        </button>
        <button type="button" className="button__auth">
          Auth
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
