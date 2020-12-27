import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUrl } from '../redux/reducers/inputStateSlice';

import { params } from '../redux/reducers/viewContextSlice';

function Params() {
  // redux
//   const _currentUrl = useSelector(currentUrl);
  const paramsView = useSelector(params);
//   const _routes = useSelector(routes);
//   const dispatch = useDispatch();

//   const { register } = useForm();

//   const url = _currentUrl.slice(7);

//   // build params list and input
//   let paramsArray;
//   Object.keys(_routes).forEach((el) => {
//     if (_routes[el][url]) {
//       Object.keys(_routes[el][url][Object.keys(_routes[el][url])[0]].config.params).forEach(
//         (param) => {
//           paramsArray = param;
//         }
//       );
//     }
//   });

  return (
    <div className="input__params" style={{ display: paramsView ? 'block' : 'none' }}>
      {/* <form>
        {paramsArray && (
          <div className="param">
            <span>:{paramsArray}</span>
            <input placeholder="param value" name="paramValue" ref={register()} />
          </div>
        )}
      </form> */}
      test
    </div>
  );
}

export default Params;
