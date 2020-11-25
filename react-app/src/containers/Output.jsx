import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { configs } from "../../redux/reducers/configsSlice";

function Output() {
  const output = useSelector(configs);

  const lines = output.map((el) => {
    return <p key={el}>{el}</p>;
  });
  useEffect(() => {
    console.log(output);
    window.scrollTo(
      0,
      document.querySelector("#index > div > div.container__output > div")
        .scrollHeight,
    );
  }, [output]);

  return (
    <div className="container__output">
      <div className="output">{lines}</div>
    </div>
  );
}

export default Output;
