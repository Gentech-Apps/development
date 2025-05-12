import React, { useState, useRef } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core';
import { useStyles } from './styles';
import moment from 'moment';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteConfirmationPopUp from '../../../../../reused-components/DeleteConfirmationPopUp';
import { deleteTask, setTaskDone } from '../../../../../../functions/api/order-process';
import StyledCheckbox from '../../../../../reused-components/StyledCheckbox';

const TasksReportTableRow = (props) => {
  const classes = useStyles();
  const { task, setLastDeletedTaskId, initProccessUpdatePopup, classesTableRow } = props;
  const {
    order_id,
    order_number,
    customer_name,
    process_name,
    task_description,
    due_date,
    resource,
    is_done,
    _id,
    task_id,
    original,
  } = task;

  const [isOpen, setIsOpen] = useState(false);
  const [done, setDone] = useState(is_done);
  const tableRow = useRef(null);
  // order process id for delete task if process is fractional, then delete from original process
  const orderProcessId = original ? original : _id;

  const openDeletePopUpHandler = () => {
    setIsOpen(true);
  };

  const deleteTaskHandler = async () => {
    const { result } = await deleteTask(orderProcessId, task_id);
    if (result) setLastDeletedTaskId(result.deleted_task_id);
  };

  const date = due_date ? moment(due_date).format('DD/MM/YYYY') : '';

  const setTaskDoneHandler = async () => {
    const { result } = await setTaskDone(orderProcessId, task_id, !done);
    if (result) setDone(result.is_done);
  };

  const initHandler = (event, order_id, _id) => {
    if (typeof event.target == 'object' && !('className' in event.target)) {
      event.stopPropagation();
      event.preventDefault();
    } else if (
      'className' in event.target &&
      !event.target.className.toString().includes('MuiTableCell-body')
    ) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      initProccessUpdatePopup({ order_id, process_id: _id, rowId: tableRow.current.id.toString() });
    }
  };

  return (
    <React.Fragment>
      <TableRow
        className={classesTableRow.rowCSS}
        onClick={(e) => initHandler(e, order_id, _id)}
        id={task_id}
        ref={tableRow}
      >
        <TableCell className={classes.styledCell}>{resource}</TableCell>
        <TableCell className={classes.styledCell}>{customer_name}</TableCell>
        <TableCell className={classes.styledCell}>{order_number}</TableCell>
        <TableCell className={classes.styledCell}>{process_name}</TableCell>
        <TableCell className={classes.styledCell}>{task_description}</TableCell>
        <TableCell className={classes.styledCell}>{date}</TableCell>
        <TableCell className={classes.skippedCell}>
          <StyledCheckbox
            className={classes.styledCheckbox}
            checked={done}
            changeHandler={setTaskDoneHandler}
            // disabled
          />
        </TableCell>
        <TableCell className={classes.skippedCell}>
          <DeleteOutlinedIcon
            fontSize={'small'}
            className={classes.colorForIcons}
            onClick={openDeletePopUpHandler}
          ></DeleteOutlinedIcon>
        </TableCell>
      </TableRow>
      <DeleteConfirmationPopUp
        okCallback={deleteTaskHandler}
        cancelCallback={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </React.Fragment>
  );
};

export default TasksReportTableRow;
