import React from 'react';
import { useStyles } from './styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
// const MenuProps={PaperProps:{ style: {maxHeight: 50}  }}

const CustomizedSelect = ({ label, value, changeHandler, options, width, disabled }) => {
  const classes = useStyles();
  return (
    <Grid item xs={width}>
      <FormControl variant="outlined" fullWidth className={`${classes.inputs}`}>
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={disabled}
          native
          value={options?.length ? (value?.name ? value?.name : value) : ''}
          onChange={(e) => changeHandler(e.target.value)}
          label={label}
          size="small"
          // style = {{maxHeight:122}}
          // MenuProps={{PaperProps:{ style: {height: '50vh'}  }}}
        >
          <option aria-label="None" value="" />
          {options?.map((i, idx) => (
            <option key={idx} value={i?.name ? i?.name : i}>
              {i?.name ? i?.name : i}
            </option>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default CustomizedSelect;
