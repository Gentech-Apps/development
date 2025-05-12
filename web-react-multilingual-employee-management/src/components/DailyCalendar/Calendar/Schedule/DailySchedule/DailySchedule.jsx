import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from '../../../style';
import UserProcesses from './UserProcesses';

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

const ScheduleForDay = ({ orders }) => {
  const { data, date } = orders;

  const oneUserPerDay = data.length === 1;
  const classes = useStyles({ oneUserPerDay });
  return (
    <Grid className={classes.scheduleForDayWrapper}>
      {
        // create timelines
        HOURS.map((i, idx) => (
          <Timeline index={idx} key={idx} />
        ))
      }
      {data.map(({ processes, user }, idx) => (
        <UserProcesses
          date={date}
          key={idx}
          processes={processes}
          index={idx}
          isLastProcess={data.length - 1 === idx}
          user={user}
        />
      ))}
    </Grid>
  );
};

const Timeline = ({ index }) => {
  const classes = useStyles({ index });
  // add 10 pixels shift for every stripe during calculation top for absolute
  return <span className={classes.timeline}></span>;
};

const MemoizedScheduleForDay = ({ orders }) =>
  useMemo(() => <ScheduleForDay orders={orders} />, [orders]);

export default MemoizedScheduleForDay;
