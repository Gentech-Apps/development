import React from 'react';
import { Select, MenuItem, FormControl } from '@material-ui/core';
import { useStyles } from '../styles';

const CustomizedSelect = (props) => {
  const { value, label, changeHandler, options /*{_id, value} */ } = props;
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select value={value ? value : label} onChange={changeHandler}>
        <MenuItem value={label}>{label}</MenuItem>
        {options?.map?.((i, idx) => (
          <MenuItem key={idx} value={i._id}>
            {i.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomizedSelect;
