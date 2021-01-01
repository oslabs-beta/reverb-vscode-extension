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
        _urls.map((el) => {
          return (
            <option key={el.href} value={JSON.stringify({ ...el })}>
              {`:${el.port}${el.pathname}`}
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
        _currentUrl.methods.map((method) => {
          return (
            <option key={method} value={method}>
              {method.toUpperCase()}
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
          setMethodState(e.target.value);
        }}
        className="select__type">
        {methodOptions}
      </select>

      <select
        onChange={(e) => {
          dispatch(setUrlState(e.target.value));
        }}
        className="select__endpoint">
        <option key="tester" value="default">
          choose domain
        </option>
        {urlOptions}
      </select>
    </form>
  );
}

export default SelectDomain;
