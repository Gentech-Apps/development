import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useStyles } from '../styles';
import { CHECK_LIST_TRANSLATION } from '../../../../../../constants/translations/customersPage';

const SystemsCheckListSectionTableHead = () => {
  const {
    INTERNAL_COMMENTS,
    IMAGE,
    REMARKS,
    CAUSE_OF_IRREGULARITY,
    PROPER_NOT_PROPER,
    TEST_DESCRIPTION,
    ACTION_REQUIRED,
    FIXED_IN_PLACE,
  } = CHECK_LIST_TRANSLATION;
  const classes = useStyles();
  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.tableHeaderCellStyle} align="center">
          {TEST_DESCRIPTION}
        </TableCell>
        <TableCell className={classes.tableHeaderCellStyle} align="center">
          {PROPER_NOT_PROPER}
        </TableCell>
        <TableCell className={classes.tableHeaderCellStyle} align="center">
          {CAUSE_OF_IRREGULARITY}
        </TableCell>
        <TableCell className={classes.tableHeaderCellStyle} align="center">
          {ACTION_REQUIRED}
        </TableCell>
        <TableCell
          className={classes.tableHeaderCellStyle}
          align="center"
          style={{
            width: '7vw',
            padding: '16px 0',
          }}
        >
          {FIXED_IN_PLACE}
        </TableCell>
        <TableCell className={classes.tableHeaderCellStyle} align="center">
          {REMARKS}
        </TableCell>
        <TableCell
          className={`${classes.tableHeaderCellStyle} ${classes.photoCell}`}
          align="center"
        >
          {IMAGE}
        </TableCell>
        {/* <TableCell className={classes.tableHeaderCellStyle} align="center">
                    {INTERNAL_COMMENTS}
                </TableCell> */}
      </TableRow>
    </TableHead>
  );
};

export default SystemsCheckListSectionTableHead;
