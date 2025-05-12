import React from 'react';
import { TableCell, TableHead, TableRow } from '@material-ui/core';
import { useStyles } from '../../../styles';
import { DELETE } from '../../../../../../../../constants/translations/review-popup';

const TestsPerFloorTableHead = (props) => {
  const { data } = props;
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        <TableCell align="right" className={classes.tableHeaderCellStyle}>
          {DELETE}
        </TableCell>
        {data.map((i, idx) => {
          const { _id, text } = i;
          return (
            <TableCell align="right" key={_id} className={classes.tableHeaderCellStyle}>
              {text}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default TestsPerFloorTableHead;
