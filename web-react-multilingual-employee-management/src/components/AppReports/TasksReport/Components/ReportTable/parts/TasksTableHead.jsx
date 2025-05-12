import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ORDER_TASKS_REPORT } from '../../../../../../constants/translations/order-tasks-report';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const TasksTableHead = (props) => {
  const {
    RESOURCE_NAME,
    CUSTOMER_NAME,
    ORDER_NUMBER,
    PROCESS_NAME,
    OPEN_TASKS,
    DUE_DATE,
    STATUS,
    REMOVE,
  } = ORDER_TASKS_REPORT;

  const { sortDirection, changeSortDirection } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell>{RESOURCE_NAME}</TableCell>
        <TableCell>{CUSTOMER_NAME}</TableCell>
        <TableCell>{ORDER_NUMBER}</TableCell>
        <TableCell>{PROCESS_NAME}</TableCell>
        <TableCell>{OPEN_TASKS}</TableCell>
        <TableCell>
          <TableSortLabel
            active={true}
            direction={sortDirection}
            onClick={changeSortDirection}
            // hideSortIcon={}
          >
            {DUE_DATE}
          </TableSortLabel>
        </TableCell>
        <TableCell>{STATUS}</TableCell>
        <TableCell>{REMOVE}</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TasksTableHead;
