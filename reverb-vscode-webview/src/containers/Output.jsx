import React from 'react';
import VerboseOutput from '../components/VerboseOuput/VerboseOutput';
import OutputHeader from '../components/OutputHeader';

function Output() {
  return (
    <div className="container__output">
      <OutputHeader />
      <VerboseOutput />
    </div>
  );
}

export default Output;
