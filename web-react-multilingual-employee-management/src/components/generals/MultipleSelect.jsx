import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: '#f9f9f9',
  },
  label: {
    color: 'black',
    marginBottom: '5px',
  },
}));

function MultipleSelect(props) {
  const classes = useStyles();
  const { label, options, handleChange, value, stateName } = props;

  return (
    <Grid item xs={12}>
      <InputLabel className={classes.label}>{label}</InputLabel>
      <Autocomplete
        multiple={true}
        options={options}
        getOptionLabel={(option) => option.name}
        onChange={(e, value) => {
          handleChange(stateName, value);
        }}
        defaultValue={value}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            className={classes.input}
            size="small"
            variant="outlined"
            // value={value}
          />
        )}
      />
    </Grid>
  );
}

export default MultipleSelect;
