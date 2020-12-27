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

  const _currentUrl = useSelector(currentUrl);
  const _currentPreset = useSelector(currentPreset);
  const _presets = useSelector(presets);
  const _urls = useSelector(urls);
  const dispatch = useDispatch();

  useEffect(() => {
    if (_urls[_currentUrl] === undefined) return;
    if (_currentUrl === 'default' || !_urls[_currentUrl].presets.length) {
      return setPresetOptions([]);
    }
    setPresetOptions(
      _urls[_currentUrl].presets.map((id) => {
        return (
          <option key={id} value={id}>
            {_presets[id].name}
          </option>
        );
      })
    );
  }, [_currentUrl, _presets]);

  return (
    <form className="select__preset flexR">
      {inputVisible ? (
        <input placeholder="Preset name" className="preset_name" />
      ) : (
        <select
          className="select__preset flexR"
          value={_currentPreset}
          onChange={(e) => {
            if (_presets[e.target.value] === undefined) {
              dispatch(setCurrentPreset('default'));
            } else {
              dispatch(setCurrentPreset(e.target.value));
            }
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
