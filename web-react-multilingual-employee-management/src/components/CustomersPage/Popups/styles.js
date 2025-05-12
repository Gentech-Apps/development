import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  colorForButtons: {
    backgroundColor: '#0091ff',
    color: 'white',
  },
  marginButton: {
    marginBottom: theme.spacing(2),
  },
  link: {
    color: '#0091ff',
    cursor: 'pointer',
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 30px',
    width: '80%',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  inputs: {
    width: '100%',
    margin: theme.spacing(1),
  },
}));
