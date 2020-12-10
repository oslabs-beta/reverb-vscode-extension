import React from 'react';
import { useSelector } from 'react-redux';
import { context } from '../../redux/reducers/inputContext';
import WatchMainTab from './WatchMainTab';

function WatchOutput() {
  const { outputTabContext } = useSelector(context);

  function renderTab(x) {
    switch (x) {
      case 'main':
        return <WatchMainTab />;
      default:
        return <WatchMainTab />;
    }
  }

  return renderTab(outputTabContext);
}

export default WatchOutput;
