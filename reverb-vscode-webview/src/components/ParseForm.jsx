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

import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  serverPaths,
  rootDirectory,
  vscApi,
  validatePort,
  validPort,
} from '../redux/reducers/inputStateSlice';

function ParseForm() {
  // Redux
  const _serverPaths = useSelector(serverPaths);
  const _rootDirectory = useSelector(rootDirectory);
  const _validPort = useSelector(validPort);
  const dispatch = useDispatch();

  const port = useRef(null);
  const url = useRef(null);

  const handleSubmit = (e) => {
    const serverData = {
      file_path: url.current.value,
      port: port.current.value,
    };
    port.current.value = '';
    dispatch(vscApi({ command: 'parseServer', data: serverData }));
  };

  // Build select options array
  const pathsArr = [];
  if (_serverPaths) {
    _serverPaths.forEach((path, i) => {
      const substr = path.substring(path.indexOf(_rootDirectory));
      pathsArr.push(
        <option key={path + i} value={path}>
          {substr}
        </option>
      );
    });
  }

  return (
    <form onSubmit={handleSubmit} className="input__parse">
      <div>
        <select ref={url} name="file_path" className="select__path">
          <option key="default" value="default">
            select server file
          </option>
          {pathsArr}
        </select>
        <input
          ref={port}
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

        <input type="submit" value="Confirm" className="button__send" />
      </div>
    </form>
  );
}

export default ParseForm;
