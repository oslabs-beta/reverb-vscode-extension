import React, { useEffect } from 'react';
import Main from './containers/Main';
import Output from './containers/Output';
import { useDispatch, useSelector } from 'react-redux';
import { getMasterObject, loading } from './redux/reducers/inputStateSlice';

function App() {
  const _loading = useSelector(loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMasterObject());
  }, []);

  if (_loading) {
    return <p>Loading...</p>;
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
