import { makeStyles } from '@material-ui/core/styles';
import { PinDropSharp } from '@material-ui/icons';
import {
  LIGHT_BLUE,
  NAV_FONT_SIZE,
  NAV_FONT_SIZE_LARGE,
  TEXT_COLOR,
} from '../../../../../constants/review-popup';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '95vw',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  // my styles
  lastChildNotBorderRadius: {
    '&:last-child': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  MuiAccordionroot: {
    justifyContent: 'space-between',
    width: '100%',
    '&.MuiAccordion-root:before': {
      display: 'none',
    },
  },
  systemInfo: {
    // direction: 'rtl',
    // fontSize: NAV_FONT_SIZE,
    [theme.breakpoints.up('sm')]: {
      fontSize: NAV_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: NAV_FONT_SIZE_LARGE,
    },
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: TEXT_COLOR,
    '&:after': {
      content: '""',
      bottom: 0,
      left: 0,
      right: 0,
      height: '5px',
      opacity: 1,
      position: 'absolute',
      background: (props) => props.completedStatus,
      width: '96%',
    },
  },
  accordionDetailsRoot: {
    padding: theme.spacing(0),
  },
  AccordionSummaryRoot: {
    flexDirection: 'row-reverse',
    width: 'calc(100% - 62px)',
  },
  systemWrapper: {
    width: '95vw',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
