import { configureStore } from '@reduxjs/toolkit';

import viewContextReducer from './reducers/viewContextSlice';
import inputStateReducer from './reducers/inputStateSlice';

export default configureStore({
  reducer: {
    viewContext: viewContextReducer,
    inputState: inputStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
