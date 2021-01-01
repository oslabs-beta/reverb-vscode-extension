/**
 * ************************************
 *
 * @module  inputCookies.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description user input for cookie key/value pairs
 *
 * ************************************
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, FieldArray } from 'formik';

import { setCookieState, cookieState } from '../redux/reducers/inputStateSlice';
import { cookies } from '../redux/reducers/viewContextSlice';

function InputCookies() {
  const _cookieState = useSelector(cookieState);
  const cookiesView = useSelector(cookies);
  const dispatch = useDispatch();

  return (
    <Formik initialValues={_cookieState} enableReinitialize={true}>
      {({ values }) => (
        <Form className="cookie__form" style={{ display: cookiesView ? 'block' : 'none' }}>
          <FieldArray name="cookies">
            {({ remove, push }) => (
              <div className="input__cookie flexC">
                {values.cookies.length > 0 &&
                  values.cookies.map((cookie, index) => (
                    <div className="cookie__li flexR" key={index}>
                      <Field
                        name={`cookies.${index}.key`}
                        placeholder="cookie"
                        type="text"
                        autoFocus={true}
                        onBlur={() => {
                          dispatch(setCookieState(values));
                        }}
                      />
                      <Field
                        name={`cookies.${index}.value`}
                        placeholder="value"
                        type="text"
                        onBlur={() => {
                          dispatch(setCookieState(values));
                        }}
                      />
                      <button type="button" onClick={() => remove(index)}>
                        x
                      </button>
                    </div>
                  ))}

                <div className="cookie__li flexR">
                  {/* these look like inputs but are buttons that add a new row of inputs above them when clicked */}
                  <input
                    type="text"
                    placeholder="cookie"
                    value=""
                    onClick={() => push({ key: '', value: '' })}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="value"
                    value=""
                    onClick={() => push({ key: '', value: '' })}
                    readOnly
                  />
                </div>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
}

export default InputCookies;
