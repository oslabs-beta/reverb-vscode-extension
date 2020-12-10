import React from 'react';
import { useSelector } from 'react-redux';
import { output } from '../../redux/reducers/outputSlice';
import { context } from '../../redux/reducers/inputContext';
import VerboseResponseTab from './VerboseResponseTab';
import VerboseHeaderTab from './VerboseHeaderTab';
import VerboseInfoTab from './VerboseInfoTab';

function VerboseOutput() {
  const { verboseOutput } = useSelector(output);
  const { outputTabContext } = useSelector(context);

  function renderTab(x) {
    switch (x) {
      case 'response':
        return <VerboseResponseTab data={verboseOutput.data} />;
      case 'header':
        return <VerboseHeaderTab header={verboseOutput.headers} />;
      case 'info':
        return <VerboseInfoTab />;
      default:
        return <VerboseResponseTab />;
    }
  }

  return renderTab(outputTabContext);
}

export default VerboseOutput;
