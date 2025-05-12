import React, { useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from '../../../style';
import { MILISECONDS_PER_HOUR } from '../../../../../constants';
import { Draggable } from 'react-beautiful-dnd';
import DailyCalendarTools from '../../../tools';
import UpdateProccessPopupContext from '../../../UpdateProcessPopupContext';

const Process = (props) => {
  const { order_process, isFirstProcess, isLastProcess, index } = props;
  const { proccess: process, user } = order_process;
  const { color: backgroundColor, process_name, actual_duration, sub_department_id } = process;
  const { _id: userId } = user;
  const actualDurationHours = actual_duration / MILISECONDS_PER_HOUR;
  const { setSelectedProcessHandler } = useContext(UpdateProccessPopupContext);

  const classes = useStyles({
    backgroundColor,
    isFirstProcess,
    isLastProcess,
    actualDurationHours,
  });

  return (
    <Draggable
      draggableId={DailyCalendarTools.createDragableId(process._id, userId, sub_department_id)}
      index={index}
    >
      {(provided, snapshot) => {
        return (
          <Grid
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setSelectedProcessHandler(order_process)}
            className={classes.orderProcess}
          >
            <span className={classes.processStripe}></span>
            <Typography variant="h6" className={classes.processName}>
              {process_name}
            </Typography>
            <span className={`${classes.processStripe} ${classes.whiteStripe}`}></span>
          </Grid>
        );
      }}
    </Draggable>
  );
};

export default Process;
