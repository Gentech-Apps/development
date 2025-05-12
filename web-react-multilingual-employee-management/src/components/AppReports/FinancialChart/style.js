import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  annualFinancialH1: {
    width: '50%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    direction: 'ltr',
  },
  annualFinancialH2: {
    width: '30%',
    justifyContent: 'end',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBarColor: {
    width: '13px',
    height: '13px',
    marginLeft: '5px',
  },
  headerColor: {
    display: 'flex',
    alignItems: 'center',
  },
  BarPresentation: {
    padding: '0 10px',
    float: 'left',
  },
}));
