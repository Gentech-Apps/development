import React from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from '../../style';
import { DragDropContext } from 'react-beautiful-dnd';
import HoursAside from './HoursAside';
import ScheduleForDay from './DailySchedule/DailySchedule';

const Schedule = (props) => {
  const { daysWithProcesses, onDragEnd } = props;
  const classes = useStyles();

  return (
    <Grid className={classes.scheduleWrapper}>
      <HoursAside />
      <DragDropContext onDragEnd={onDragEnd}>
        {daysWithProcesses.map((i, idx) => (
          <ScheduleForDay key={idx} orders={i} />
        ))}
      </DragDropContext>
    </Grid>
  );
};

export default Schedule;
