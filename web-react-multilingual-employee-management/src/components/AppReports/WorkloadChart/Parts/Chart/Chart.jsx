import React from 'react';
import { Grid } from '@material-ui/core';
import Aside from './Aside';
import Presentation from './Presentation';
import { useStyles } from '../../styles';

const Chart = (props) => {
  const classes = useStyles();
  const { chartData } = props;
  const { chart, ...chartAside } = chartData;
  return (
    <Grid className={classes.chartContainer}>
      <Aside chartAside={chartAside} chart={chart} />
      <Presentation chartData={chart} />
    </Grid>
  );
};

export default Chart;
