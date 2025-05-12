import React from 'react';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { useStyles } from '../style';

const AnnualFinancialHeader = (props) => {
  const { total_actual, total_planned } = props.total_actual_plan;
  const classes = useStyles();

  return (
    <header className="Annual-financial-header">
      <Grid className={classes.annualFinancialH1}>
        <Typography>
          <span style={{ fontWeight: 'bold' }}>{total_actual.toLocaleString()}</span> :{' '}
          {'סה"כ בפועל'}
        </Typography>
        <Typography>
          <span style={{ fontWeight: 'bold' }}>{total_planned.toLocaleString()}</span> :{' '}
          {'סה"כ מתוכנן'}
        </Typography>
      </Grid>
      <Grid className={`${classes.annualFinancialH1} ${classes.annualFinancialH2}`}>
        <div className={classes.headerColor}>
          <Typography>צפי</Typography>
          {/* Green */}
          <Typography
            style={{ background: '#73a835' }}
            className={classes.headerBarColor}
          ></Typography>
        </div>
        <div className={classes.headerColor}>
          <Typography>תכנון</Typography>
          {/* Yellow */}
          <Typography
            style={{ background: '#ffc107' }}
            className={classes.headerBarColor}
          ></Typography>
        </div>
        <div className={classes.headerColor}>
          <Typography>בפועל</Typography>
          {/* Blue */}
          <Typography
            style={{ background: '#0091ff' }}
            className={classes.headerBarColor}
          ></Typography>
        </div>
      </Grid>
    </header>
  );
};

export default AnnualFinancialHeader;
