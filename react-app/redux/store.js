import { configureStore } from "@reduxjs/toolkit";
import routesReducer from "./reducers/routesSlice";
import configsReducer from "./reducers/configsSlice";

export default configureStore({
  reducer: {
    configs: configsReducer,
    routes: routesReducer,
  },
});
