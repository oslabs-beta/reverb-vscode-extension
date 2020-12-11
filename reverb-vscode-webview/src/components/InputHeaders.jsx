import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderInputContext, context } from '../redux/reducers/inputContext';

function InputHeaders() {
  const { headerInputContext } = useSelector(context);
  const dispatch = useDispatch();

  const { register, control, watch } = useForm({
    defaultValues: {
      headers: headerInputContext,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });

  function setHeaders() {
    const headers = watch('headers');

    if (headers) {
      dispatch(setHeaderInputContext(headers));
    } else {
      dispatch(setHeaderInputContext([]));
    }
  }

  useEffect(() => {
    setHeaders();
  }, [fields]);

  return (
    <form className="input__header">
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id} className="header__li">
              <input
                name={`headers[${index}].key`}
                onChange={() => setHeaders()}
                placeholder="key"
                defaultValue={item.key}
                ref={register()}
              />

              <input
                name={`headers[${index}].value`}
                onChange={() => setHeaders()}
                placeholder="value"
                defaultValue={item.value}
                ref={register()}
              />

              <button
                type="button"
                onClick={() => {
                  remove(index);
                }}>
                x
              </button>
            </li>
          );
        })}
      </ul>
      <section>
        <li className="header__li">
          <input
            placeholder="new header"
            defaultValue=""
            onClick={() => {
              if (fields.length < 4) append({ key: '', value: '' });
            }}
          />
          <input
            placeholder="new value"
            defaultValue=""
            onClick={() => {
              if (fields.length < 4) append({ key: '', value: '' });
            }}
          />
        </li>
      </section>
    </form>
  );
}

export default InputHeaders;
