import { makeStyles } from '@material-ui/core';
import {
  BUTTON_WIDTH,
  NAV_FONT_SIZE,
  BUTTON_WIDTH_LARGE,
  TEXT_FONT_SIZE,
  TEXT_FONT_SIZE_LARGE,
  ICON_WIDTH,
  ICON_WIDTH_LARGE,
  DIALOG_BACKGROUND_COLOR,
  BLUE_COLOR,
  TEXT_COLOR,
  BORDER_COLOR,
  CLOSE_BUTTON_BACKGROUND,
  LIGHT_BLUE,
  WHITE_COLOR,
} from '../../../../constants/review-popup';

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '33%',
  },
  timerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '33%',
    height: '1vh',
  },
  dialogTitleText: {
    minWidth: '100px',
    color: BLUE_COLOR,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // fontSize: TEXT_FONT_SIZE,
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      fontSize: TEXT_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: TEXT_FONT_SIZE_LARGE,
    },
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
  signIcon: {
    cursor: 'pointer',
    color: `${BLUE_COLOR} !important`,
    // width: ICON_WIDTH,
    [theme.breakpoints.up('sm')]: {
      fontSize: ICON_WIDTH,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: ICON_WIDTH_LARGE,
    },
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
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
  startText: {
    color: BLUE_COLOR,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    fontSize: TEXT_FONT_SIZE_LARGE,
    fontWeight: 500,
    lineHeight: '1.2',
    // [theme.breakpoints.up('sm')]: {
    //     fontSize: TEXT_FONT_SIZE
    // },
    // [theme.breakpoints.up('lg')]: {
    //     fontSize: TEXT_FONT_SIZE_LARGE
    // },
  },
  endText: {
    color: TEXT_COLOR,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    // fontSize: TIMER_FONT_SIZE,
    fontSize: TEXT_FONT_SIZE_LARGE,
    fontWeight: 500,
    lineHeight: '1.2',
    // [theme.breakpoints.up('sm')]: {
    //     fontSize: TEXT_FONT_SIZE
    // },
    // [theme.breakpoints.up('lg')]: {
    //     fontSize: TEXT_FONT_SIZE_LARGE
    // },
  },
  editOrderButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(100% / 3)',
    justifyContent: 'space-between',
  },
  customerNameRoot: {
    color: TEXT_COLOR,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    // fontSize: TEXT_FONT_SIZE,
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      fontSize: TEXT_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: TEXT_FONT_SIZE_LARGE,
    },
  },
  textRoot: {
    color: BLUE_COLOR,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    // fontSize: TEXT_FONT_SIZE,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      fontSize: TEXT_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: TEXT_FONT_SIZE_LARGE,
    },
  },
  editResourceWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'calc(100% / 3)',
  },
  mapButtonWrapper: {
    width: 'calc(100% / 3)',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navItemWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(100% / 3)',
    cursor: 'pointer',
    borderBottom: `3px solid ${BORDER_COLOR}`,
  },
}));
