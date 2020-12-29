/**
 * ************************************
 *
 * @module  SelectDomain.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/23/2020
 * @description Drop downs for method and domain selection.
 *
 * ************************************
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  setMethodState,
  setUrlState,
  urls,
  currentUrl,
} from '../../redux/reducers/inputStateSlice';

function SelectDomain() {
  const [urlOptions, setUrlOptions] = useState([]);
  const [methodOptions, setMethodOptions] = useState([]);

  const _urls = useSelector(urls);
  const _currentUrl = useSelector(currentUrl);
  const dispatch = useDispatch();

  useEffect(() => {
    if (_urls !== undefined) {
      setUrlOptions(
        Object.keys(_urls).map((el) => {
          return (
            <option
              key={_urls[el].url}
              value={JSON.stringify({ url: _urls[el].url, path: _urls[el].path })}>
              {`:${_urls[el].port}${_urls[el].pathname}`}
            </option>
          );
        })
      );
    }
  }, [_urls]);

  useEffect(() => {
    if (_currentUrl === 'default') {
      setMethodOptions([]);
    } else {
      setMethodOptions(
        Object.keys(_urls[_currentUrl].ranges).map((el) => {
          el = el.toUpperCase();
          return (
            <option key={el} value={el}>
              {el}
            </option>
          );
        })
      );
    }
  }, [_currentUrl]);

  return (
    <form className="select__domain flexR">
      <select
        onChange={(e) => {
          dispatch(setMethodState(e.target.value));
        }}
        className="select__type">
        {methodOptions}
      </select>

      <select
        onChange={(e) => {
          dispatch(setUrlState(e.target.value));
        }}
        className="select__endpoint">
        <option key="tester" value={JSON.stringify({ url: 'default', path: 'default' })}>
          choose domain
        </option>
        {urlOptions}
      </select>
    </form>
  );
}

export default SelectDomain;
