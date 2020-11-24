import React from "react";
import { useForm } from "react-hook-form";

function Select({ routes, group, axiosReq }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    axiosReq(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={group}>
      <select ref={register} name="type" className="select__type">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <select ref={register} name="route" className="select__endpoint">
        {routes}
      </select>

      <input type="submit" value="Send" className="button__send" />
    </form>
  );
}

export default Select;
