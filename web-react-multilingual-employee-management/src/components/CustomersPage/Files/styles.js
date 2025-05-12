import { makeStyles } from '@material-ui/core/styles';
import {
  ICON_SIZE,
  BLUE_COLOR,
  NAV_FONT_SIZE,
  NAV_FONT_SIZE_LARGE,
} from '../../../constants/review-popup';
import { MAX_TAB_CONTENT_HEIGHT } from '../../../constants/customers-page';

export const useStyles = makeStyles((theme) => ({
  filesHolder: {
    // height: "99%",
    overflow: 'auto',
    padding: theme.spacing(3),
    maxHeight: MAX_TAB_CONTENT_HEIGHT,
  },
  fileContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  fileName: {
    width: `calc(100% - ${ICON_SIZE} - ${ICON_SIZE} - ${ICON_SIZE} - ${ICON_SIZE})`,
    // fontSize: NAV_FONT_SIZE,
    borderBottom: `5px solid ${BLUE_COLOR}`,
    textAlign: 'start',
    [theme.breakpoints.up('sm')]: {
      fontSize: NAV_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: NAV_FONT_SIZE_LARGE,
    },
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
    fontWeight: 500,
    color: '#4A4A4A',
  },

  smallFileContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  smallFileName: {
    fontSize: '1vw',
    width: `calc(100% - ${ICON_SIZE} - ${ICON_SIZE} - ${ICON_SIZE} - ${ICON_SIZE})`,
    // fontSize: NAV_FONT_SIZE,
    borderBottom: `5px solid ${BLUE_COLOR}`,
    textAlign: 'start',
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
    fontWeight: 500,
    color: '#4A4A4A',
  },
  buttonsWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));
