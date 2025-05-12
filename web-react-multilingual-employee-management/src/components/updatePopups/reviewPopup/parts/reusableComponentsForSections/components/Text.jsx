import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../styles';

const InputTextMobile = ({ rowIdx, colIdx, changeHandler, placeholder, value, label }) => {
  const classes = useStyles();

  return (
    <TextField
      className={`${classes.textarea} ${classes.inputs}`}
      multiline
      label={label}
      variant="outlined"
      margin="dense"
      placeholder={placeholder}
      value={value}
      onChange={(e) => changeHandler(colIdx, rowIdx, e.target.value)}
    />
  );
};

export default InputTextMobile;
