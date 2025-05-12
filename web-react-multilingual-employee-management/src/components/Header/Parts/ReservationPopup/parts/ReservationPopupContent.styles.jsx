import { Checkbox, TextField, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';

export const CustomCheckbox = withStyles({
  root: {
    color: '#0091ff',
    padding: '4px',
    '&$checked': {
      color: '#0091ff',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const CustomAutocomplete = withStyles({
  root: {
    width: '100%',
    height: '40px',
    cursor: 'pointer',
    fontFamily: 'Rubik',
    fontSize: '14px',

    '& .MuiAutocomplete-option[aria-selected="true"]': {
      backgroundColor: 'green',
    },
    '& .MuiAutocomplete-inputRoot': {
      paddingLeft: '65px!important',
      paddingRight: '7px!important',
    },
  },
  popper: {
    '& .MuiAutocomplete-option[aria-selected="true"]': {
      backgroundColor: 'transparent',
    },
  },
  inputRoot: {
    '& .MuiAutocomplete-endAdornment': {
      left: '0px',
      right: 'unset!important',
    },
  },
  clearIndicator: {
    color: 'rgb(0,0,0)',
  },
  popupIndicator: {
    marginLeft: '10px',
    color: 'rgb(0,0,0)',
  },
  option: {},
})((props) => <Autocomplete {...props} />);

export const CustomTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f9f9f9',
      padding: '2px',
      marginBottom: '20px',
      '& .MuiAutocomplete-tag': {
        backgroundColor: 'transparent',
        height: '28px',
        border: 'solid 1px #e2e2e2',
        fontFamily: 'Rubik',
        fontSize: '14px',
        color: 'rgb(0, 0, 0)',
      },
      '& fieldset': {
        border: 'solid 1px #e2e2e2',
      },
      '&:hover fieldset': {
        border: 'solid 1px #e2e2e2',
      },
      '&.Mui-focused fieldset': {
        border: 'solid 1px #e2e2e2',
      },
    },
  },
})((props) => <TextField {...props} />);
