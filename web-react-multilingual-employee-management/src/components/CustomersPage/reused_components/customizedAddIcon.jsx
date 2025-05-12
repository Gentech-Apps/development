import React, { useState } from 'react';
import addIcon from '../../../images/reviewPopup/add.svg';
import { useStyles } from './style';

const CustomizedAddIcon = (props) => {
  const classes = useStyles();
  const { clickHandler } = props;
  return <img src={addIcon} alt="add file" className={classes.icon} onClick={clickHandler} />;
};

export default CustomizedAddIcon;
