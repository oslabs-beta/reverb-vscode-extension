/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { context, setInputViewContext } from '../redux/reducers/inputContext';

function ParseForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    mode: 'onChange',
  });

  const { possibleServerFilePaths, rootDir, validPort } = useSelector(context);

  const pathsArr = [];
  if (possibleServerFilePaths) {
    possibleServerFilePaths.forEach((path, i) => {
      const substr = path.substring(path.indexOf(rootDir));
      pathsArr.push(
        <option key={path + i} value={path}>
          {substr}
        </option>
      );
    });
  }

  const onSubmit = (data) => {
    if (validPort && data.port.length === 4) {
      // eslint-disable-next-line no-undef
      vscode.postMessage({ command: 'parseServer', data });
      dispatch(setInputViewContext('header'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="input__parse">
      <p>enter port number and select main server file</p>
      <div>
        <input
          ref={register}
          onChange={({ target }) => {
            const data = target.value;
            // eslint-disable-next-line no-undef
            if (data.length === 4) vscode.postMessage({ command: 'validatePort', data });
          }}
          name="port"
          placeholder="PORT"
          autoFocus
          className={validPort ? 'input__port' : 'port__error input__port'}
        />
        {/* {validPort === false && <p className="error__port">server not listening on port</p>} */}

        <select ref={register} name="file_path" className="select__path">
          {pathsArr}
        </select>

        <input type="submit" value="Confirm" className="button__send" />
      </div>
    </form>
  );
}

export default ParseForm;
