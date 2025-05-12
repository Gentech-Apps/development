import React from 'react';
import { useStyles } from './styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const CustomizedTextArea = ({ label, value, changeHandler, width, height, disabled }) => {
  const classes = useStyles();
  return (
    <Grid item xs={width}>
      <TextField
        fullWidth
        multiline
        rows={height ? height : 3}
        className={classes.inputs}
        label={label}
        variant="outlined"
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
        disabled={!changeHandler || disabled}
      />
    </Grid>
  );
};

export default CustomizedTextArea;
