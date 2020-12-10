import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setCookieInputContext, context } from '../redux/reducers/inputContext';

function InputHeaders() {
  const { cookieInputContext } = useSelector(context);
  const dispatch = useDispatch();

  const { register, control, getValues } = useForm({
    defaultValues: {
      cookies: cookieInputContext,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cookies',
  });

  function setCookies() {
    const { cookies } = getValues();
    if (cookies) {
      dispatch(setCookieInputContext(cookies));
    } else {
      dispatch(setCookieInputContext([]));
    }
  }

  useEffect(() => {
    setCookies();
  }, [fields]);

  return (
    <form className="input__cookie">
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id} className="cookie__li">
              <input
                name={`cookies[${index}].key`}
                onChange={() => setCookies()}
                placeholder="key"
                defaultValue={item.key}
                ref={register()}
              />

              <input
                name={`cookies[${index}].value`}
                onChange={() => setCookies()}
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
            placeholder="new cookie"
            defaultValue=""
            onClick={() => {
              if(fields.length < 4) append({ key: '', value: '' });
            }}
          />
          <input
            placeholder="new value"
            defaultValue=""
            onClick={() => {
              if(fields.length < 4) append({ key: '', value: '' });
            }}
          />
        </li>
      </section>
    </form>
  );
}

export default InputHeaders;
