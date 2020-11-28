import React from "react";
import { useForm } from "react-hook-form";

function Select({ routes }) {
  const { register, handleSubmit } = useForm();
  console.log("Select.jsx => Select => routes:", routes);

  return (
    <form
      onSubmit={handleSubmit(({ method, url }) => {
        return vscode.postMessage({
          command: "sendRequest",
          config: { method, url: `http://${url}` },
        });
      })}
    >
      <select ref={register} name="method" className="select__type">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <select ref={register} name="url" className="select__endpoint">
        {routes}
      </select>

      <input type="submit" value="Send" className="button__send" />
    </form>
  );
}

export default Select;
