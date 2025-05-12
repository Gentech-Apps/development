import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { useStyles } from '../styles';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { MAX_SINGLE_INPUT } from '../../../../../../constants/admin-systems';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';

const InputSelectMobile = ({
  rowIdx,
  colIdx,
  changeHandler,
  placeholder,
  label,
  value,
  options,
  type,
}) => {
  const classes = useStyles();

  const renderValue = (value) => (
    <div className={classes.chips}>
      {value.map((v) =>
        v ? <Chip size="small" key={v} label={v} className={classes.chip} /> : '',
      )}
    </div>
  );

  const createOptions = (options) => {
    const result = options?.map((i) => i.option) || [];
    return _.compact(result);
  };

  return (
    <FormControl variant="outlined" margin="dense" fullWidth>
      <Autocomplete
        multiple={type >= MAX_SINGLE_INPUT}
        options={createOptions(options)}
        getOptionLabel={(option) =>
          option && typeof option === 'string' ? option : option?.join?.() || ''
        }
        // value={value && value.length ? value : []}
        value={value}
        onChange={(e, value) => changeHandler(colIdx, rowIdx, value)}
        classes={{ paper: classes.autoComplete }}
        renderInput={(params) => (
          <TextField
            dir="ltr"
            padding="dense"
            {...params}
            variant="outlined"
            label={label}
            placeholder={placeholder}
            className={classes.inputs + ' ' + classes.textfield}
          />
        )}
      />
    </FormControl>
  );
};

export default InputSelectMobile;
