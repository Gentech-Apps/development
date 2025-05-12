import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import CustomerOrdersTableRow from './CustomerOrdersTableRow';

const CustomerOrdersTableBody = ({ data, setOrders }) => {
  return (
    <TableBody>
      {data ? (
        data.map((i) => <CustomerOrdersTableRow key={i._id} data={i} setOrders={setOrders} />)
      ) : (
        <TableRow />
      )}
    </TableBody>
  );
};

export default CustomerOrdersTableBody;
