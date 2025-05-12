import React from 'react';
import { Grid } from '@material-ui/core';

const FiltersAndAdditionalActionsWrapper = (props) => {
  const { children } = props;
  return (
    <Grid
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
        padding: '10px 15px',
        backgroundColor: '#E5E5E5',
      }}
    >
      {children}
    </Grid>
  );
};

export default FiltersAndAdditionalActionsWrapper;
