import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';

const CheckboxMobile = (props) => {
  const { rowIdx, colIdx, changeHandler, label, checked } = props;
  return (
    <FormControlLabel
      control={
        <Checkbox
          style={{ color: '#0091ff' }}
          checked={checked}
          onClick={(e) => changeHandler(colIdx, rowIdx, e.target.checked)}
        />
      }
      label={label}
      labelPlacement="start"
    />
  );
};

export default CheckboxMobile;
