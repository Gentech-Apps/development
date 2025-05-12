import React from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from '../../../style';
import { Droppable } from 'react-beautiful-dnd';
import DailyCalendarTools from '../../../tools';

const UserProcesses = (props) => {
  const { processes, index, isLastProcess, date, user } = props;
  const { _id: userId, sub_departments } = user;
  const isFirstProcess = !index;
  const classes = useStyles({ index, isFirstProcess });
  const schedule = DailyCalendarTools.createScheduleForUser(
    processes,
    isFirstProcess,
    isLastProcess,
  );
  const dropppableId = DailyCalendarTools.createDroppableId(date, userId, sub_departments);
  return (
    <Droppable
      droppableId={dropppableId}
      // isDropDisabled = {false}
    >
      {(provided, snapshot) => {
        schedule.push(provided.placeholder);
        return (
          <Grid
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classes.userProcesses}
          >
            {schedule}
          </Grid>
        );
      }}
    </Droppable>
  );
};

export default UserProcesses;
