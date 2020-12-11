import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { context, setParamsInputContext } from '../redux/reducers/inputContext';
import { useForm } from 'react-hook-form';
import { routes } from '../redux/reducers/routesSlice';

function Params() {
  const { register, handleSubmit, watch, errors } = useForm();
  const dispatch = useDispatch();
  const { paramsInputContext, urlInputContext } = useSelector(context);
  const rts = useSelector(routes);
  const url = urlInputContext.slice(7);
  let params;

  Object.keys(rts).forEach((el) => {
    if (rts[el][url]) {
      Object.keys(rts[el][url][Object.keys(rts[el][url])[0]].config.params).forEach((param) => {
        params = param;
      });
    }
  });

  let parami = watch('paramValue');

  useEffect(() => {
    if (parami !== undefined) {
      dispatch(setParamsInputContext(parami));
    }
  }, [parami]);

  return (
    <div className="input__params">
      <form>
        {params && (
          <div className="param">
            <span>:{params}</span>
            <input
              defaultValue={paramsInputContext}
              placeholder="param value"
              name="paramValue"
              ref={register()}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Params;
