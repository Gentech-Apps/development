import React, { useState, useRef } from 'react';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { EDIT_POP_UP } from '../../../../constants/translations/customersPage';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { useStyles } from './styles';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteConfirmationPopUp from '../../../reused-components/DeleteConfirmationPopUp';

const OrderTask = (props) => {
  const { resources, data, editTask, deleteTask } = props;
  const { description, due_date, resource_id, is_done, _id, temporarilyId } = data;
  const classes = useStyles();

  const { TASK_DESCRIPTION, DONE, RESOURCE } = EDIT_POP_UP;
  const identifier = _id ? _id : temporarilyId;
  const [isDeletePopupShown, setDeletePopupShown] = useState(false);
  const RESOURCE_ID = 'resource_id';
  const DESCRIPTION = 'description';
  const IS_TASK_DONE = 'is_done';
  const TASK_DUE_DATE = 'due_date';

  const changeTaskName = (e) => {
    e.preventDefault();
    const { value } = e.target;
    editTask(identifier, DESCRIPTION, value);
  };

  const handleChangeResource = (e) => {
    const { value } = e.target;
    editTask(identifier, RESOURCE_ID, value);
  };

  const handleChangeDone = (e) => {
    e.preventDefault();
    const { checked } = e.target;
    editTask(identifier, IS_TASK_DONE, checked);
  };

  const changeDateHandler = (date) => {
    editTask(identifier, TASK_DUE_DATE, date);
  };

  const openDeletePopUpHandler = () => {
    setDeletePopupShown(true);
  };

  return (
    <Grid container className={`${classes.root}`}>
      <Grid item xs={12} className={classes.descriptionHolder}>
        <TextField
          size="small"
          fullWidth
          multiline
          size="small"
          onChange={changeTaskName}
          value={description}
        />
      </Grid>
      <Grid item xs={1}>
        <DeleteOutlinedIcon
          fontSize={'default'}
          className={classes.deleteIcon}
          onClick={openDeletePopUpHandler}
        />
      </Grid>
      <Grid item xs={5}>
        <Select
          value={resource_id}
          onChange={handleChangeResource}
          displayEmpty
          placeholder={RESOURCE}
          fullWidth
          className={classes.inputs}
        >
          <MenuItem value={resource_id ? resource_id : ''}></MenuItem>
          {resources.map((i, idx) => (
            <MenuItem key={i._id} value={i._id}>
              {i.name}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={4}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            variant="inline"
            className={classes.inputs}
            format="dd/MM/yyyy"
            value={due_date}
            onChange={changeDateHandler}
            autoOk={true}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={2}>
        <Checkbox checked={is_done} onChange={handleChangeDone} className={classes.checkBox} />
      </Grid>
      <DeleteConfirmationPopUp
        okCallback={() => deleteTask(identifier)}
        cancelCallback={() => setDeletePopupShown(false)}
        isOpen={isDeletePopupShown}
      />
    </Grid>
  );
};

export default OrderTask;
