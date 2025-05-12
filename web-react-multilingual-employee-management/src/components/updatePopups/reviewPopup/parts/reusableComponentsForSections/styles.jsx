import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  inputs: {
    width: '100%',
    margin: theme.spacing(1),
  },
  option: {
    maxWidth: '100%',
  },
  textarea: {
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  mandatoryPhotoMessage: {
    color: 'red',
    fontSize: '16px',
  },
  editSystemButton: {
    fontSize: '20px',
    color: '#0091ff',
  },
  textfield: {
    '& .MuiInputBase-input.MuiAutocomplete-input': {
      textAlign: 'right',
    },
  },
  autoComplete: {
    '& .MuiAutocomplete-option': {
      direction: 'ltr',
      justifyContent: 'flex-end',
    },
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: '100%',
    },
  },
};
