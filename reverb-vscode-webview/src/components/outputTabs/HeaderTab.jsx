import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { useSelector } from 'react-redux';
import { requestResult } from '../../redux/reducers/inputStateSlice';

function HeaderTab() {
  const { headers } = useSelector(requestResult);
  let data;
  if (headers !== undefined && headers !== null) {
    data = Object.keys(headers).map((el) => {
      return { key: el, value: headers[el] };
    });
  }

  const columns = [
    { minWidth: 150, maxWidth: 250, accessor: 'key' },
    {
      accessor: 'value',
    },
  ];

  return (
    <div className="verbose__header">
      <ReactTable
        className="-striped -highlight"
        minRows={0}
        defaultPageSize={10}
        showPageSizeOptions={false}
        showPageJump={false}
        showPaginationTop={false}
        data={data}
        columns={columns}
      />
    </div>
  );
}

export default HeaderTab;
