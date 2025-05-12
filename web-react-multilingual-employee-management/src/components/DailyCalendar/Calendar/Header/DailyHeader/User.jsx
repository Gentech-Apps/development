import React from 'react';
import { useStyles } from '../../../style';
import { Grid, Typography } from '@material-ui/core';

const User = ({ data, isLast, oneUserPerADay, index }) => {
  const FIRST_ELEMENT_IN_ARRAY_INDEX = 0;
  const name = data.user.full_name;
  const overloaded = data?.overloaded;
  const firstUser = index === FIRST_ELEMENT_IN_ARRAY_INDEX;
  const classes = useStyles({ isLast, oneUserPerADay, firstUser, overloaded });

  return (
    <Grid className={classes.userContainer}>
      <Typography variant="h6" className={classes.userName}>
        {name}
      </Typography>
    </Grid>
  );
};

export default User;
