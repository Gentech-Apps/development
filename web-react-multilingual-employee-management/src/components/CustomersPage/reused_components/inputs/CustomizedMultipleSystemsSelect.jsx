import React from 'react';
import { useStyles } from './styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';

const CustomizedMultipleSystemsSelect = ({
  label,
  // value,
  changeHandler,
  options,
  disabled,
}) => {
  const getOptionLabel = (option) => {
    const { name, actual_system_name, location_floor, location_description } = option;
    const systemName = name || '';
    const actualSystemName = actual_system_name ? ' ~ ' + actual_system_name : '';
    const locationFloor = location_floor ? ' ~ ' + location_floor : '';
    const locationDescription = location_description ? ' ~ ' + location_description : '';

    const optionDescription = systemName + actualSystemName + locationFloor + locationDescription;
    return optionDescription;
  };

  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Autocomplete
        multiple={true}
        options={options}
        getOptionLabel={(option) => getOptionLabel(option)}
        onChange={(e, value) => {
          changeHandler(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            className={classes.inputs}
            label={label}
            variant="outlined"
            // value={value}
            disabled={disabled}
          />
        )}
      />
    </Grid>
  );
};

export default CustomizedMultipleSystemsSelect;
