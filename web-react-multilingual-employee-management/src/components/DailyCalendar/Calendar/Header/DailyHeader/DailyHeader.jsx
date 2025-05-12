import React, { useMemo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import { useStyles } from '../../../style';
import User from './User';

const DayHeader = ({ day }) => {
  const { date, data } = day;
  const classes = useStyles();
  return (
    <Grid className={classes.headerDateAndUsersWrapper}>
      <Typography variant="h6" className={classes.headerDate}>
        {moment(date).format('dd DD/MM').toUpperCase()}
      </Typography>
      <Grid className={classes.usersWrapper}>
        {data.map((i, idx) => {
          const isLast = idx === data.length - 1;
          const oneUserPerADay = data.length === 1;
          const userId = i.user._id;
          return (
            <User
              key={userId + idx}
              data={i}
              isLast={isLast}
              oneUserPerADay={oneUserPerADay}
              index={idx}
            />
          );
        })}
      </Grid>
    </Grid>
  );
};

const MemoizedDayHeader = ({ day }) => useMemo(() => <DayHeader day={day} />, [day]);

export default MemoizedDayHeader;
