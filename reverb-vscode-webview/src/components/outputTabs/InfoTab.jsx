import React from 'react';
import Iframe from 'react-iframe';
import { useSelector } from 'react-redux';
import { requestResult } from '../../redux/reducers/inputStateSlice';

function InfoTab() {
  const _requestResult= useSelector(requestResult);

  return (
    <div className="verbose__info">
      <Iframe
        src={_requestResult.config.baseURL}
        width="100%"
        height="100%"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
        sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
      />
    </div>
  );
}

export default InfoTab;
