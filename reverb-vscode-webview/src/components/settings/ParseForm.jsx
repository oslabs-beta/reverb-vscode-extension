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

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  serverPaths,
  rootDirectory,
  vscApi,
  validatePort,
  validPort,
  setValidPort,
} from '../../redux/reducers/inputStateSlice';

function ParseForm() {
  // Redux
  const _serverPaths = useSelector(serverPaths);
  const _rootDirectory = useSelector(rootDirectory);
  const _validPort = useSelector(validPort);
  const dispatch = useDispatch();

  const [parsed, setParsed] = useState(null);
  const port = useRef(null);
  const url = useRef(null);
  const portWarningText = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (url.current.value === 'default' || !_validPort) {
      portWarningText.current.innerHTML = 'FAILED: invalid port';
      setTimeout(() => {
        portWarningText.current.innerHTML = `server not listening on port`;
      }, 2000);
      return;
    }

    const serverData = {
      file_path: url.current.value,
      port: port.current.value,
    };
    port.current.value = '';
    setParsed('Parse successful!');
    setTimeout(() => setParsed(''), 3500);
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

  // checks port validity every n seconds until _validPort becomes true
  useEffect(() => {
    if (_validPort === true) return;
    let int = setInterval(() => {
      dispatch(validatePort(port.current.value));
    }, 1000);

    return () => {
      if (int !== undefined) {
        clearInterval(int);
        dispatch(setValidPort(true));
      }
    };
  }, [_validPort]);

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
            if (target.value.length >= 4 && _validPort) {
              dispatch(validatePort(target.value));
            }
          }}
          name="port"
          placeholder="PORT"
          autoFocus
          className={_validPort ? 'input__port' : 'port__error input__port'}
        />

        <input type="submit" value="Confirm" className="button__send" />
        {_validPort ? null : (
          <p ref={portWarningText} className="valid__port">
            server not listening on port
          </p>
        )}
        <p className="parsed">{parsed}</p>
      </div>
    </form>
  );
}

export default ParseForm;
