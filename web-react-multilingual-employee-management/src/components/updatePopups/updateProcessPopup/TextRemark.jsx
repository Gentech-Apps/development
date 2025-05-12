import React from 'react';
import TextField from '@material-ui/core/TextField';
import { InputLabel } from '@material-ui/core';

const TextRemark = (props) => {
  const { value, changeHandler, label } = props;
  return (
    <React.Fragment>
      <InputLabel
        style={{
          marginBottom: '5px',
          color: 'black',
        }}
      >
        {label}
      </InputLabel>
      <TextField
        variant="outlined"
        value={value}
        size="small"
        style={{ width: '100%' }}
        onChange={(e) => changeHandler({ remark: e.target.value })}
      />
    </React.Fragment>
  );
};

export default TextRemark;
