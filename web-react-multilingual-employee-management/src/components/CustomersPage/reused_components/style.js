import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  BUTTON_WIDTH,
  NAV_FONT_SIZE,
  BUTTON_WIDTH_LARGE,
  TEXT_FONT_SIZE_LARGE,
  ICON_WIDTH,
  ICON_WIDTH_LARGE,
} from '../../../constants/review-popup';

export const useStyles = makeStyles((theme) => ({
  line: {
    display: 'block',
    content: '',
    width: '100%',
    height: '2px',
    backgroundColor: 'rgba(224, 224, 224, 1)',
    marginBottom: '10px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  verticalLine: {
    content: '',
    display: 'block',
    width: '3px',
    backgroundColor: 'rgba(224, 224, 224, 1)',
    margin: ' 15px 60px',
  },
  goBackButton: {
    backgroundColor: '#0091ff',
    borderRadius: '20px',
    color: '#ffffff',
    fontWeight: '500',
  },
  icon: {
    cursor: 'pointer',
    // width: ICON_WIDTH,
    [theme.breakpoints.up('sm')]: {
      width: ICON_WIDTH,
    },
    [theme.breakpoints.up('lg')]: {
      width: ICON_WIDTH_LARGE,
    },
  },
  rootCustomizedButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      width: BUTTON_WIDTH,
    },
    [theme.breakpoints.up('lg')]: {
      width: BUTTON_WIDTH_LARGE,
    },
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    borderRadius: '50px',
    // fontSize: TEXT_FONT_SIZE,
    fontWeight: 600,
    cursor: 'pointer',
    // fontSize: TEXT_FONT_SIZE_LARGE
    [theme.breakpoints.up('sm')]: {
      fontSize: NAV_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: TEXT_FONT_SIZE_LARGE,
    },
  },
  buttonsWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));
