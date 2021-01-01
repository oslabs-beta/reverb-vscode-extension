/**
 * ************************************
 *
 * @module  EraseStorage.jsx
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/26/2020
 * @description contains conditional logic for deleting
 *
 * ************************************
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { wipeStorageObject } from '../../redux/reducers/inputStateSlice';

function EraseStorage() {
  const [confirm, setConfirm] = useState(false);
  const [erased, setErased] = useState(false);

  const dispatch = useDispatch();

  return (
    <>
      <div className="setting__wipe" style={{ display: confirm ? 'none' : 'flex' }}>
        <button
          type="button"
          className="button__wipe"
          title="ERASE"
          onClick={() => {
            setConfirm(true);
          }}>
          ERASE
        </button>
        <p>
          erase <u>ALL</u> stored data
        </p>
      </div>
      <div className="setting__wipe" style={{ display: confirm && !erased ? 'flex' : 'none' }}>
        <p style={{ color: 'red' }}>Are you sure?</p>
        <button
          type="button"
          className="button__wipe yes"
          title="YES"
          onClick={() => {
            dispatch(wipeStorageObject({ command: 'wipeStorageObject' }));
            setErased(true);
            setTimeout(() => {
              setErased(false);
              setConfirm(false);
            }, 2000);
          }}>
          YES
        </button>
        <button
          type="button"
          className="button__wipe no"
          title="NO"
          onClick={() => {
            setConfirm(false);
          }}>
          NO
        </button>
      </div>
      <div className="setting__wipe" style={{ display: erased ? 'flex' : 'none' }}>
        <p style={{ color: 'green', fontSize: '1.3rem' }}>Storage Deleted!</p>
      </div>
    </>
  );
}

export default EraseStorage;
