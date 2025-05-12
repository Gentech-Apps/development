import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from '../../style';
import { TIMELINES } from '../../../../constants/translations/daily-page';
import DayHeader from './DailyHeader/DailyHeader';

const CalendarHeader = (props) => {
  const classes = useStyles();
  const { daysWithProcesses } = props;
  return (
    <Grid className={classes.calendarHeaderWrapper}>
      <div className={classes.timelinesWrapper}>
        <Typography variant="h6" className={classes.timelineTypography}>
          {TIMELINES}
        </Typography>
        <Grid className={classes.headerEmptyAside}></Grid>
      </div>
      {daysWithProcesses.map((day) => (
        <DayHeader day={day} key={day.date} />
      ))}
    </Grid>
  );
};

export default CalendarHeader;
