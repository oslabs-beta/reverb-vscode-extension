/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { output } from '../../redux/reducers/outputSlice';

function WatchMainTab() {
  const { watchOutput } = useSelector(output);

  const lines = watchOutput.map((el) => {
    if (el.error && el.data) {
      const elData = JSON.parse(el.data);
      return (
        <div className="output__item error" key={el.time ? el.time : el.column + el.line}>
          <p>{` [${elData.config.url}] <${elData.config.method.toUpperCase()}> ==> ${
            elData.message
          }`}</p>
        </div>
      );
    }
    if (el.error === true) {
      return (
        <div className="output__item error" key={el.time}>
          <p>{` [${el.url}] <${el.method.toUpperCase()}> ==> ${el.status}`}</p>
        </div>
      );
    }
    if (el.error === false) {
      return (
        <div className="output__item" key={el.time ? el.time : el.column + el.line}>
          <p>{` [${el.url}] <${el.method}> ==> status: ${el.status}`}</p>
        </div>
      );
    }
  });
  useEffect(() => {
    document.querySelector('.watch__main').scrollTop = document.querySelector(
      '.watch__main'
    ).scrollHeight;
  }, [watchOutput]);

  return <div className="watch__main">{lines}</div>;
}

export default WatchMainTab;
