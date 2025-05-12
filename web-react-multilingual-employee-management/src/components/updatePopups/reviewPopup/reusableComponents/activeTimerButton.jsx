import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { STARTED_AT, PRESS_TO_END } from '../../../../constants/translations/review-popup';
import stopTimer from '../../../../images/reviewPopup/end_timer.svg';
import { useStyles } from './styles';

const ActiveTimerButton = (props) => {
  const { clickHandler, startTime, view } = props;
  const classes = useStyles();
  const [timerStart, setTimerStart] = useState('');

  useEffect(() => {
    if (startTime) {
      const date = new Date(+startTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      setTimerStart(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    }
  }, [startTime]);

  return (
    <div className={classes.timerContainer}>
      <Grid>
        <Typography variant="h6" classes={{ root: classes.startText }} style={{ display: view }}>
          {STARTED_AT(timerStart)}
        </Typography>
        <Typography variant="h6" classes={{ root: classes.endText }} style={{ display: view }}>
          {PRESS_TO_END}
        </Typography>
      </Grid>
      <img
        src={stopTimer}
        alt="stop timer"
        className={classes.icon}
        onClick={clickHandler}
        style={{ display: view }}
      />
    </div>
  );
};

export default ActiveTimerButton;
