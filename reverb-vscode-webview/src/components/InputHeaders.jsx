/**
 * ************************************
 *
 * @module  inputHeaders.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description user input for header key/value pairs
 *
 * ************************************
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, FieldArray } from 'formik';

import { setHeaderState, headerState } from '../redux/reducers/inputStateSlice';
import { header } from '../redux/reducers/viewContextSlice';

function InputHeaders() {
  const _headerState = useSelector(headerState);
  const headersView = useSelector(header);
  const dispatch = useDispatch();

  return (
    <Formik initialValues={_headerState} enableReinitialize={true}>
      {({ values }) => (
        <Form className="header__form" style={{ display: headersView ? 'block' : 'none' }}>
          <FieldArray name="headers">
            {({ remove, push }) => (
              <div className="input__header">
                {values.headers.length > 0 &&
                  values.headers.map((header, index) => (
                    <div className="header__li" key={index}>
                      <Field
                        name={`headers.${index}.key`}
                        placeholder="header"
                        type="text"
                        onBlur={() => {
                          dispatch(setHeaderState(values));
                        }}
                      />
                      <Field
                        name={`headers.${index}.value`}
                        placeholder="value"
                        type="text"
                        onBlur={() => {
                          dispatch(setHeaderState(values));
                        }}
                      />
                      <button type="button" onClick={() => remove(index)}>
                        x
                      </button>
                    </div>
                  ))}
                <div className="header__li">
                  {/* these look like inputs but are buttons that add a new row of inputs above them when clicked */}
                  <input
                    type="text"
                    placeholder="header"
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

export default InputHeaders;
