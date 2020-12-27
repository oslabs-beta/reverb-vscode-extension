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

import { setMethodState, setUrlState, urls } from '../../redux/reducers/inputStateSlice';

function SelectDomain() {
  const [urlOptions, setUrlOptions] = useState([]);

  const _urls = useSelector(urls);
  const dispatch = useDispatch();

  useEffect(() => {
    // populate dropdown options
    if (_urls !== undefined) {
      setUrlOptions(
        Object.keys(_urls).map((el) => {
          return (
            <option
              key={_urls[el].url}
              value={JSON.stringify({ url: _urls[el].url, path: _urls[el].path })}>
              {_urls[el].url.slice(7)}
            </option>
          );
        })
      );
    }
  }, [_urls]);

  return (
    <form className="select__domain flexR">
      <select
        onChange={(e) => {
          dispatch(setMethodState(e.target.value));
        }}
        className="select__type">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
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
