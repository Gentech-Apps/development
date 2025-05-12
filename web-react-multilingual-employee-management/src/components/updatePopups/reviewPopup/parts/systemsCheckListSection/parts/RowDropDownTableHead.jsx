import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const RowDropDownTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="center">Remove</TableCell>
        {/* <TableCell align="center">Link</TableCell> */}
        <TableCell align="center">Picture</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default RowDropDownTableHead;
