/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from '../redux/reducers/routesSlice';

import {
  setCurrentPreset,
  setMethodAndUrl,
  setInputViewContext,
  savePreset,
  context,
  sendVerboseRequest,
} from '../redux/reducers/inputContext';

function Select() {
  const [inputVisible, setInputVisible] = useState(false);
  const [presetsArray, setPresetsArray] = useState([]);
  const { presets, currentPreset, urlInputContext, inputViewContext } = useSelector(context);
  const route = useSelector(routes);
  const dispatch = useDispatch();
  const { register, handleSubmit, getValues, setValue } = useForm();

  const onSubmit = () => {
    dispatch(sendVerboseRequest());
  };

  const routesArr = [];
  if (route) {
    Object.keys(route).forEach((key) => {
      Object.keys(route[key]).forEach((subkey) => {
        routesArr.push(
          <option key={subkey} value={subkey}>
            {subkey}
          </option>
        );
      });
    });
  }

  const renderPresets = (url) => {
    const temp = [];

    if (presets[url]) {
      presets[url].forEach((item) => {
        if (item.name === currentPreset.name) {
          temp.unshift(
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          );
          setValue('presets', currentPreset.name);
        } else {
          temp.push(
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          );
        }
      });

      setPresetsArray(temp);
    } else {
      setPresetsArray([
        <option key="213" value="default">
          No Presets for Route
        </option>,
      ]);
      dispatch(
        setCurrentPreset({
          name: 'default',
          url: 'default',
          headerInputContext: [],
          cookieInputContext: [],
          dataInputContext: '{\n\n}',
        })
      );
    }
  };

  useEffect(() => {
    renderPresets(urlInputContext);
  }, [presets]);

  function setUrlState() {
    const { method, url } = getValues();
    dispatch(setMethodAndUrl({ method, url: `http://${url}` }));
  }

  const savePresetContext = () => {
    setInputVisible(false);
    const { preset_name } = getValues();
    // check dup / overwite?
    if (preset_name) {
      dispatch(savePreset({ preset_name, urlInputContext }));
    } else {
      // enter name

      console.log('no preset name');
    }
  };

  const refreshPresets = () => {
    const cache = inputViewContext;
    dispatch(setInputViewContext('settings'));
    setTimeout(() => {
      dispatch(setInputViewContext(cache));
    });
  };

  const getPresetData = (name) => {
    presets[urlInputContext].forEach((preset) => {
      if (preset.name === name) {
        dispatch(setCurrentPreset(preset));
      }
    });
    refreshPresets();
  };
  useEffect(() => {
    if (presets[urlInputContext]) {
      dispatch(setCurrentPreset(presets[urlInputContext][0]));
    }
    renderPresets(urlInputContext);
    refreshPresets();
  }, [urlInputContext]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="group__left">
          <select
            ref={register}
            name="method"
            onChange={() => setUrlState()}
            className="select__type">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <select
            ref={register}
            name="url"
            onChange={() => {
              setUrlState();
            }}
            className="select__endpoint">
            <option key="tester" value="default">
              Choose Domain
            </option>
            {routesArr}
          </select>

          <input type="submit" value="Send" className="button__send" />
        </div>

        <div className="group__right">
          {inputVisible ? (
            <input
              name="preset_name"
              placeholder="Preset name"
              className="preset_name"
              autoFocus
              ref={register()}
            />
          ) : (
            <select
              ref={register}
              name="presets"
              className="select__preset"
              onChange={(e) => {
                getPresetData(e.target.value);
              }}>
              {presetsArray}
            </select>
          )}

          {inputVisible ? (
            <button type="button" className="button__save" onClick={() => savePresetContext()}>
              Save
            </button>
          ) : (
            <div>
              <button type="button" className="button__add" onClick={() => setInputVisible(true)}>
                +
              </button>
            </div>
          )}
          <button
            type="button"
            className="button__rmPreset"
            title="remove preset"
            onClick={() => {
              const data = currentPreset;
              dispatch(
                setCurrentPreset({
                  name: 'default',
                  url: 'default',
                  headerInputContext: [],
                  cookieInputContext: [],
                  dataInputContext: '{\n\n}',
                })
              );
              return vscode.postMessage({
                command: 'deletePreset',
                data,
              });
            }}>
            -
          </button>
        </div>
      </form>
    </>
  );
}

export default Select;
