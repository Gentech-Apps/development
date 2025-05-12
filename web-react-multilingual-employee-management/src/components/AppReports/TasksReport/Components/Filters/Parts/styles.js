import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  searchIcon: {
    margin: '10px 10px 5px',
  },
  searchIconActive: {
    color: '#0091ff',
    cursor: 'pointer',
  },
}));
