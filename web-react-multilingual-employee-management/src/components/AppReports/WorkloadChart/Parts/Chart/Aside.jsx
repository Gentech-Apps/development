import React from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from '../../styles';
import { OVERLOADED } from '../../../../../constants/translations/order-tasks-report';
import { ChartTools } from '../../tools';
import { Typography } from '@material-ui/core';

const ChartAside = (props) => {
  const classes = useStyles();
  const { chartAside, chart } = props;
  const { sub_department_name: subDepartmentName } = chartAside;
  const overloaded = new ChartTools().getOverloaded(chart);
  return (
    <Grid className={classes.aside}>
      <Typography>{subDepartmentName}</Typography>
      <Typography className={classes.redText}>{overloaded ? OVERLOADED : ''}</Typography>
      <Typography className={classes.redText}>{overloaded}</Typography>
    </Grid>
  );
};

export default ChartAside;
