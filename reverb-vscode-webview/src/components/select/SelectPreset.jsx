/**
 * ************************************
 *
 * @module  SelectPreset.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description Drop down for preset selection and input for saving new preset.
 *
 * ************************************
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setCurrentPreset,
  vscApi,
  savePreset,
  currentUrl,
  currentPreset,
  urls,
  presets,
} from '../../redux/reducers/inputStateSlice';

function SelectPreset() {
  const [inputVisible, setInputVisible] = useState(false);
  const [presetOptions, setPresetOptions] = useState([]);

  const _currentPreset = useSelector(currentPreset);
  const _presets = useSelector(presets);
  const dispatch = useDispatch();

  useEffect(() => {
    if (_presets === undefined) return setPresetOptions([]);
    setPresetOptions(
      Object.keys(_presets).map((preset) => {
        return (
          <option key={_presets[preset].id} value={JSON.stringify(_presets[preset])}>
            {_presets[preset].name}
          </option>
        );
      })
    );
  }, [_presets, _currentPreset]);

  return (
    <form className="select__preset flexR">
      {inputVisible ? (
        <input placeholder="Preset name" className="preset_name" />
      ) : (
        <select
          className="select__preset flexR"
          value={JSON.stringify(_currentPreset)}
          onChange={(e) => {
            dispatch(setCurrentPreset(e.target.value));
          }}>
          <option key="default" value="default">
            no preset on endpoint
          </option>
          {presetOptions}
        </select>
      )}

      {inputVisible ? (
        <button
          type="button"
          className="button__save"
          onClick={(e) => {
            dispatch(savePreset(e.target.previousElementSibling.value));
            setInputVisible(false);
          }}>
          save
        </button>
      ) : (
        <button type="button" className="button__add" onClick={() => setInputVisible(true)}>
          +
        </button>
      )}
      <button
        type="button"
        className="button__rmPreset"
        title="remove preset"
        onClick={() => {
          dispatch(vscApi({ command: 'deletePreset', data: _currentPreset }));
        }}>
        -
      </button>
    </form>
  );
}

export default SelectPreset;
