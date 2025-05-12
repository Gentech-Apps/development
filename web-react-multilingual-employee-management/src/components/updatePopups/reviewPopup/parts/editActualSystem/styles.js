import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
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
  buttonsAndTrashIcon: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  systemInfo: {
    marginBottom: '10px',
  },
  editSystemButton: {
    fontSize: '20px',
    color: '#0091ff',
  },
}));
