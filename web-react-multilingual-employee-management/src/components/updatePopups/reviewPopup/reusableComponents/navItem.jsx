import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useStyles } from './styles';

const NavItem = (props) => {
  const { clickHandler, text } = props;
  const classes = useStyles();
  return (
    <Grid className={classes.navItemWrapper} onClick={clickHandler}>
      <Typography variant="h6" classes={{ root: classes.textRoot }}>
        {text}
      </Typography>
    </Grid>
  );
};

export default NavItem;
