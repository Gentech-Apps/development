import React from 'react';
import TextField from '@material-ui/core/TextField';

const CustomizedTimePicker = (props) => {
  const { label, value, changeHandler, disabled, clickHandler, name } = props;
  return (
    <TextField
      disabled={disabled}
      label={label}
      type="time"
      value={value || ''}
      format="HH:mm"
      size="small"
      style={{ width: '30%' }}
      onChange={(e) => changeHandler({ [name]: e.target.value })}
      onClick={(e) => clickHandler(e)}
    />
  );
};

export default CustomizedTimePicker;
