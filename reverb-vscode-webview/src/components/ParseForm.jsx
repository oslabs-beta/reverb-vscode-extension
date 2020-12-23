/**
 * ************************************
 *
 * @module  ParseForm.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description renders dropdown and inputfield so user can define main serverFile info to be sent to extension and parsed.
 *
 * ************************************
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import {
  possibleServerFilePaths,
  rootDirectory,
  vscApi,
  validatePort,
  validPort,
} from '../redux/reducers/inputStateSlice';

function ParseForm() {
  // Redux
  const _possibleServerFilePaths = useSelector(possibleServerFilePaths);
  const _rootDirectory = useSelector(rootDirectory);
  const _validPort = useSelector(validPort);
  const dispatch = useDispatch();

  // Form base
  const { register, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const onSubmit = (serverData) => {
    dispatch(vscApi({ command: 'parseServer', data: serverData }));
  };

  // Build select options array
  const pathsArr = [];
  if (_possibleServerFilePaths) {
    _possibleServerFilePaths.forEach((path, i) => {
      const substr = path.substring(path.indexOf(_rootDirectory));
      pathsArr.push(
        <option key={path + i} value={path}>
          {substr}
        </option>
      );
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="input__parse">
      <p>enter port number and select main server file</p>
      <div>
        <input
          ref={register}
          onChange={({ target }) => {
            if (target.value.length === 4) {
              dispatch(validatePort(target.value));
            }
          }}
          name="port"
          placeholder="PORT"
          autoFocus
          className={_validPort ? 'input__port' : 'port__error input__port'}
        />

        <select ref={register} name="file_path" className="select__path">
          {pathsArr}
        </select>

        <input type="submit" value="Confirm" className="button__send" />
      </div>
    </form>
  );
}

export default ParseForm;
