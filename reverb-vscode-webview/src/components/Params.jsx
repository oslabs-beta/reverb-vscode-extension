import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { context, setHeaderInputContext } from '../redux/reducers/inputContext';
import {routes} from '../redux/reducers/routesSlice';

function Params() {
//   const dispatch = useDispatch();
//   const { paramsInputContext,userConfigs, urlInputContext } = useSelector(context);

//   Object.keys(userConfigs).forEach((el) =>{
//     console.log(el, urlInputContext)
//   })
//     console.log(rts)
  return (
    <div className="input__params">
        <button
          type="button"
          className="button__test"
          title="ERASE"
          onClick={() => {
            // eslint-disable-next-line no-undef
            return vscode.postMessage({
              command: 'deleteRoutesObject',
            });
          }}>
          Test all known Endpoints
        </button>
        <p>Erase ALL stored data</p>
    </div>
  );
}

export default Params;