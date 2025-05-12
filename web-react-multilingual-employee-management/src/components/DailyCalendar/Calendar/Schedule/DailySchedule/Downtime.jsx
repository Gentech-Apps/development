import React from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from '../../../style';
import { MILISECONDS_PER_HOUR } from '../../../../../constants';

const Downtime = (props) => {
  const { duration, isFirstProcess, isLastProcess } = props;
  const actualDurationHours = duration / MILISECONDS_PER_HOUR;
  const classes = useStyles({ isFirstProcess, isLastProcess, actualDurationHours });
  return <Grid className={classes.downtime}></Grid>;
};

export default Downtime;
