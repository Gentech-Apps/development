import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  icon: {
    width: '30px',
    height: '30px',
  },
}));

const TestIcon = (props) => {
  const { link } = props;
  const classes = useStyles();
  return link ? (
    <div className={classes.iconWrapper}>
      <img src={link} alt="icon" className={classes.icon} />
    </div>
  ) : null;
};

export default TestIcon;
