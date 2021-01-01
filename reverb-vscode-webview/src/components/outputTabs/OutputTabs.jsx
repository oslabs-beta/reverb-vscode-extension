import React from 'react';
import { useSelector } from 'react-redux';

import { outputTabContext } from '../../redux/reducers/viewContextSlice';
import ResponseTab from './ResponseTab';
import HeaderTab from './HeaderTab';
import InfoTab from './InfoTab';

function OutputTabs() {
  const _outputTabContext = useSelector(outputTabContext);

  function renderTab(x) {
    switch (x) {
      case 'response':
        return <ResponseTab />;
      case 'header':
        return <HeaderTab />;
    //   case 'info':
    //     return <InfoTab />;
      default:
        return <ResponseTab />;
    }
  }

  return renderTab(_outputTabContext);
}

export default OutputTabs;
