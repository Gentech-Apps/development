import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    border: '2px solid #0091ff',
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '10px',
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
  },
  timeSectionWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: (props) => (props.service ? 'space-evenly' : 'space-between'),
    margin: '8px 0',
  },
  inputTypeNumber: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));
