import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { configs } from "../../redux/reducers/configsSlice";

function Output() {
  const output = useSelector(configs);
  console.log("Output.jsx => Output => output:", output);

  const lines = output.map((el) => {
    let data;
    if (el.data) {
      data = <p>{`${JSON.stringify(el.data, null, 2)}`}</p>;
    }
    return (
      <div className="output__item" key={el.time}>
        <p>{`> [${el.time}] ${el.method} ${el.url} responded with status: ${el.status}`}</p>
        {data}
      </div>
    );
  });
  useEffect(() => {
    document.querySelector(".output").scrollTop = document.querySelector(
      ".output",
    ).scrollHeight;
  }, [output]);

  return (
    <div className="container__output">
      <div className="output">{lines}</div>
    </div>
  );
}

export default Output;
