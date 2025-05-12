import React from 'react';
import { useStyles } from './styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CUSTOMERS_PAGE } from '../../../../constants/translations/customersPage';

export const CustomizedAutocompleteSelect = ({ label, value, changeHandler, options }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Autocomplete
        options={options || []}
        getOptionLabel={(option) => option.name}
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
            value={value}
          />
        )}
      />
    </Grid>
  );
};

export const CustomizedAutocompleteSelectMultiple = ({ label, value, changeHandler, options }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Autocomplete
        options={options || []}
        multiple
        getOptionLabel={(option) => option.name}
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
            value={value}
          />
        )}
      />
    </Grid>
  );
};

export const CustomizedAutocompleteSelectGroup = ({ label, value, changeHandler, options }) => {
  const { LAYER } = CUSTOMERS_PAGE;
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Autocomplete
        options={options || []}
        getOptionLabel={(option) => option.name}
        onChange={(e, value) => {
          changeHandler(value);
        }}
        groupBy={(option) => `${LAYER} ${option?.layer}`}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            className={classes.inputs}
            label={label}
            variant="outlined"
            value={value}
          />
        )}
      />
    </Grid>
  );
};
