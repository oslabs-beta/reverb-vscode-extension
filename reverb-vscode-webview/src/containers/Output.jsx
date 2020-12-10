import React from 'react';
import { useSelector } from 'react-redux';
import { context } from '../redux/reducers/inputContext';
import WatchOutput from '../components/WatchOutput/WatchOutput';
import VerboseOutput from '../components/VerboseOuput/VerboseOutput';
import OutputHeader from '../components/OutputHeader';

function Output() {
  const { watchState } = useSelector(context);
  console.log(watchState, 'output render');

  return (
    <div className="container__output">
      <OutputHeader watchState={watchState} />
      {watchState === 'on' ? <WatchOutput /> : <VerboseOutput />}
    </div>
  );
}

export default Output;
