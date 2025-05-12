import React from 'react';
import { useStyles } from './style';

const VerticalLine = ({ height }) => {
  const classes = useStyles();
  return <span className={classes.verticalLine} style={{ height: height * 0.9 }}></span>;
};

export default VerticalLine;
