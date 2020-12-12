import React from 'react';
import Iframe from 'react-iframe';
import { useSelector } from 'react-redux';
import { context } from '../../redux/reducers/inputContext';

function VerboseInfoTab() {
  const { urlInputContext } = useSelector(context);

  return (
    <div className="verbose__info">
      <Iframe
        url={urlInputContext}
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

export default VerboseInfoTab;
