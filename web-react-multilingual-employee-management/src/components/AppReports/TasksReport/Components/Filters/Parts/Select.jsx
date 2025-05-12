import React, { useState, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useStyles } from './styles';
import { ORDER_TASKS_REPORT } from '../../../../../../constants/translations/order-tasks-report';

const FiltersSelect = (props) => {
  const { RESOURCE_NAME, CUSTOMER_NAME, ORDER_NUMBER } = ORDER_TASKS_REPORT;
  const classes = useStyles();
  const { label, handleChange, value, optionsData } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const optionCreator = (data) => {
      const { _id, full_name, name, order_number } = data;
      switch (label) {
        case RESOURCE_NAME:
          return { _id, value: full_name };
        case CUSTOMER_NAME:
          return { _id, value: name };
        case ORDER_NUMBER:
          return { _id, value: order_number };
      }
    };
    const newOptions = optionsData?.map?.(optionCreator);
    setOptions(newOptions);
  }, [optionsData, label]);

  const changeHandler = (event) => {
    const { value } = event.target;
    if (value === label) {
      handleChange('');
      return;
    }
    handleChange(value);
  };

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
export default FiltersSelect;
