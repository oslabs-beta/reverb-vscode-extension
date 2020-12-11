import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

function VerboseHeaderTab({ header }) {
  let data;
  if (header !== undefined && header !== null) {
    data = Object.keys(header).map((el) => {
      return { key: el, value: header[el] };
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

export default VerboseHeaderTab;
