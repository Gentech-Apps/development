import React from 'react';
import { Typography } from '@material-ui/core';
import ActivateTimer from '../../../../images/reviewPopup/start_timer.svg';
import { PRESS_TO_START } from '../../../../constants/translations/review-popup';
import { useStyles } from './styles';

const ActivateTimerButton = (props) => {
  const { clickHandler, text, view } = props;
  const classes = useStyles();
  return (
    <div className={classes.timerContainer}>
      <Typography variant="h6" classes={{ root: classes.startText }} style={{ display: view }}>
        {PRESS_TO_START}
      </Typography>
      <img
        src={ActivateTimer}
        alt="activate timer"
        onClick={clickHandler}
        className={classes.icon}
        style={{ display: view }}
      />
    </div>
  );
};

export default ActivateTimerButton;
