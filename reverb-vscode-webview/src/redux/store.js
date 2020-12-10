import { configureStore } from '@reduxjs/toolkit';
import routesReducer from './reducers/routesSlice';
import outputReducer from './reducers/outputSlice';
import inputContextReducer from './reducers/inputContext';

export default configureStore({
  reducer: {
    output: outputReducer,
    routes: routesReducer,
    context: inputContextReducer,
  },
});
