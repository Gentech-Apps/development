import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useStyles } from './style';
import MenuItem from '@material-ui/core/MenuItem';

const CustomizedInputWithLabel = (props) => {
  const classes = useStyles();
  const { label, value, changeHandler, type, options, disabled, isNotValid } = props;
  return (
    <div className={classes.inputWrapper}>
      <h3>{label}</h3>
      <TextField
        error={isNotValid && !value}
        variant="outlined"
        size="small"
        style={{ width: '200px' }}
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
        type={type}
        select={type === 'select'}
        disabled={disabled}
      >
        {options
          ? options.map((option, idx) => (
              <MenuItem key={idx} value={option}>
                {option}
              </MenuItem>
            ))
          : null}
      </TextField>
    </div>
  );
};

export default CustomizedInputWithLabel;
