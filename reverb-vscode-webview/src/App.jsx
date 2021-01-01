import React from 'react';
import Main from './containers/Main';
import Output from './containers/Output';
import Welcome from './components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { getMasterObject, loading } from './redux/reducers/inputStateSlice';

function App() {
  const _loading = useSelector(loading);
  const dispatch = useDispatch();

  if (_loading === true) {
    dispatch(getMasterObject());
    return <Welcome />;
  } else {
    return (
      <div className="grid-container">
        <Output />
        <Main />
      </div>
    );
  }
}

export default App;
