import { makeStyles } from '@material-ui/core';

const HEIGHT = 150;

export const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  // Chart
  chartContainer: {
    display: 'flex',
    borderTop: '2px solid rgb(0, 0, 0)',
    borderBottom: '2px solid rgb(0, 0, 0)',
  },
  // aside
  aside: {
    width: '15%',
    borderLeft: '3px solid rgb(0, 0, 0)',
    backgroundColor: '#f7f7f7',
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
  },
  redText: {
    color: 'red',
  },
  // presentation
  presentation: {
    width: '100%',
    marginBottom: '15px',
    height: HEIGHT,
  },
}));
