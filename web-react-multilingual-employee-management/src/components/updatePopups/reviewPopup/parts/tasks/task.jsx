import React, { useState, useRef } from 'react';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { EDIT_POP_UP } from '../../../../../constants/translations/customersPage';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { useStyles, StyledDisabledTextField } from './styles';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteConfirmationPopUp from '../../../../reused-components/DeleteConfirmationPopUp';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CustomizedEditIcon from '../../reusableComponents/editIcon';
import RtlWrapper from '../../../../reused-components/RtlWrapper';
import AddButton from '../../reusableComponents/customizedAddIcon';
import { saveTask, deleteTask } from '../../../../../functions/api';

const Task = (props) => {
  const { resources, data, editTask, orderProcessId, setTasks } = props;
  const { description, due_date, resource_id, is_done, _id, temporarilyId } = data;
  const classes = useStyles();

  const { TASK_DESCRIPTION, DONE, RESOURCE } = EDIT_POP_UP;
  const identifier = _id ? _id : temporarilyId;
  const [isDeletePopupShown, setDeletePopupShown] = useState(false);
  const [disabled, setDisabled] = useState(
    _id ? true : false,
  ); /*newly created task isn' disabled */
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

  const setEditHandler = () => setDisabled((i) => !i);

  const saveTaskHandler = async () => {
    const result = (await saveTask(orderProcessId, data)) || [];
    setTasks(result);
    setDisabled(true);
  };

  const deleteTaskHandler = async () => {
    const result = await deleteTask(orderProcessId, _id);
    setTasks(result);
  };

  return (
    <RtlWrapper>
      <Grid className={`${classes.root}`}>
        <Grid item className={classes.lineWrapper}>
          <Grid item className={classes.itemWrapper}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
              checkedIcon={<CheckBoxIcon fontSize="large" />}
              checked={is_done}
              onChange={handleChangeDone}
              className={classes.checkBox}
              style={{ paddingTop: 0 }}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} className={classes.itemWrapper}>
            <StyledDisabledTextField
              size="small"
              fullWidth
              multiline
              size="small"
              onChange={changeTaskName}
              value={description}
              // classes = {{input: classes.disabled}}
              disabled={disabled}
            />
          </Grid>
          <Grid item className={classes.itemWrapper}>
            {disabled ? <CustomizedEditIcon clickHandler={setEditHandler} /> : null}
          </Grid>
        </Grid>
        {/* -------------------------- second line -------------------------------------------------------  */}
        <Grid className={`${classes.lineWrapper} ${classes.alignItemsCenter}`}>
          <Grid item className={classes.itemWrapper}>
            <DeleteOutlinedIcon
              fontSize={'default'}
              className={classes.deleteIcon}
              onClick={openDeletePopUpHandler}
            />
          </Grid>
          <Grid className={classes.dateAndResourceWrapper}>
            <Grid item className={`${classes.itemWrapper} ${classes.selectResource}`}>
              <Select
                value={resource_id || ''}
                onChange={handleChangeResource}
                displayEmpty
                placeholder={RESOURCE}
                fullWidth
                // className={classes.inputs}
                classes={{ root: classes.inputs, disabled: classes.disabled }}
                disabled={disabled}
              >
                <MenuItem value={resource_id || ''}></MenuItem>
                {resources.map((i, idx) => (
                  <MenuItem key={i._id} value={i._id}>
                    {i.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item className={classes.itemWrapper}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  className={classes.inputs}
                  format="dd/MM/yyyy"
                  value={due_date}
                  onChange={changeDateHandler}
                  autoOk={true}
                  style={{ color: 'black !important' }}
                  disabled={disabled}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </Grid>
        <DeleteConfirmationPopUp
          okCallback={() => deleteTaskHandler(identifier)}
          cancelCallback={() => setDeletePopupShown(false)}
          isOpen={isDeletePopupShown}
        />
      </Grid>
    </RtlWrapper>
  );
};

export default Task;
