import React from 'react';
import { useStyles } from './styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const CustomizedTextField = ({ label, value, changeHandler, width, type, disabled }) => {
  const classes = useStyles();
  return (
    <Grid item xs={width}>
      <TextField
        fullWidth
        className={classes.inputs}
        label={label}
        variant="outlined"
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
        disabled={!changeHandler || disabled}
        type={type}
      />
    </Grid>
  );
};

export default CustomizedTextField;
