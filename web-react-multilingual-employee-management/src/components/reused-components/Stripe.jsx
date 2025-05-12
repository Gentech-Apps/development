import React from 'react';
import { Grid } from '@material-ui/core';

const Stripe = (props) => {
  const { children } = props;
  return (
    <Grid
      style={{
        width: '100%',
        height: '4vh',
        backgroundColor: '#243748',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </Grid>
  );
};

export default Stripe;
