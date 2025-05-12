import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from '../../style';

const HOURS = [
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 AM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
];

const HoursAside = () => {
  const classes = useStyles();
  return useMemo(() => {
    return (
      <Grid className={classes.hoursAside}>
        {HOURS.map((i, idx) => {
          return <TimelineWithTime key={idx} value={i} />;
        })}
      </Grid>
    );
  }, [HOURS]);
};

const TimelineWithTime = ({ value }) => {
  const classes = useStyles();
  return (
    <span className={classes.timelineWithTimeWrapper}>
      <span className={classes.hour}>
        <span className={classes.timeValue}>{value}</span>
      </span>
    </span>
  );
};

export default HoursAside;
