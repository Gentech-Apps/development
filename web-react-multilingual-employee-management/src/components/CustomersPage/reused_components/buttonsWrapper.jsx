import React from 'react';
import { Grid } from '@material-ui/core';

const ButtonsWrapper = (props) => {
  const { children } = props;
  return (
    <Grid
      style={{
        width: '100%',
        backgroundColor: '#F7F7F7',
        padding: '15px',
        display: 'flex',
        flexDirection: 'row-reverse',
      }}
    >
      {children}
    </Grid>
  );
};

export default ButtonsWrapper;
