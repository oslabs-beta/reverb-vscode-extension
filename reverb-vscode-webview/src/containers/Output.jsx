import React from 'react';
import OutputTabs from '../components/outputTabs/OutputTabs';
import OutputHeader from '../components/OutputHeader';

function Output() {
  return (
    <div className="container__output">
      <OutputHeader />
      <OutputTabs />
    </div>
  );
}

export default Output;
