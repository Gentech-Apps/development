import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    // border: '2px solid #0091ff',
    // borderRadius:'4px',
    padding: '10px',
    marginBottom: '10px',
  },
  itemWrapper: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  lineWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  checkBox: { margin: 0, color: '#0091ff !important' },
  inputs: {
    padding: '0 5px',
  },
  descriptionHolder: {
    marginBottom: '10px',
  },
  deleteIcon: {
    marginTop: '5px',
    color: '#0091ff',
    cursor: 'pointer',
    fontSize: '3.3vw',
  },
  timeSectionWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '8px 0',
  },
  selectResource: {
    width: '-webkit-fill-available',
  },
  disabled: {
    color: 'black',
  },
  dateAndResourceWrapper: {
    margin: 0,
    padding: 0,
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
  },
}));

export const StyledDisabledTextField = withStyles({
  root: {
    marginRight: 8,
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'black', // (default alpha is 0.38)
    },
  },
})(TextField);
