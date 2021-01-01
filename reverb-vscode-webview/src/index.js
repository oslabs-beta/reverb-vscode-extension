import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';

import './styles/index.scss';

window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.update) {
    store.dispatch({ payload: message.data, type: 'inputState/setMasterObject' });
  }
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('index')
);
