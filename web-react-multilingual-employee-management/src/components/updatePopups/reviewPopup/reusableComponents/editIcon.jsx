import React from 'react';
import editIcon from '../../../../images/reviewPopup/edit.svg';
import editRedIcon from '../../../../images/reviewPopup/editRed.svg';
import { useStyles } from './styles';

const CustomizedEditIcon = (props) => {
  const { clickHandler, style = {} } = props;
  const classes = useStyles();
  return (
    <img style={style} className={classes.icon} src={editIcon} alt="edit" onClick={clickHandler} />
  );
};

export const CustomizedEditIconRed = (props) => {
  const { clickHandler, style = {} } = props;
  const classes = useStyles();
  return (
    <img
      style={style}
      className={classes.icon}
      src={editRedIcon}
      alt="edit"
      onClick={clickHandler}
    />
  );
};

export default CustomizedEditIcon;
