import React from 'react';
import { useStyles } from './styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

const CustomizedDatePicker = ({ label, value, changeHandler, width }) => {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid item xs={width}>
        <DatePicker
          fullWidth
          disableToolbar
          variant="inline"
          inputVariant="outlined"
          className={classes.inputs}
          format="dd/MM/yyyy"
          margin="normal"
          label={label}
          value={value}
          onChange={changeHandler}
          autoOk={true}
          keyboardbuttonprops={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default CustomizedDatePicker;
