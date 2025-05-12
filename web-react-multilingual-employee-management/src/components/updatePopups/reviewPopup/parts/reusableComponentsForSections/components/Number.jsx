import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../styles';

const InputNumberMobile = ({ rowIdx, colIdx, changeHandler, label, placeholder, value }) => {
  const classes = useStyles();
  return (
    <TextField
      type="number"
      fullWidth
      label={label}
      variant="outlined"
      margin="dense"
      placeholder={placeholder}
      value={value}
      onChange={(e) => changeHandler(colIdx, rowIdx, e.target.value)}
      className={classes.inputs}
    />
  );
};

export default InputNumberMobile;
