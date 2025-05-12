import React from 'react';
import { useStyles } from './style';

const Line = () => {
  const classes = useStyles();
  return <span className={classes.line}></span>;
};

export default Line;
