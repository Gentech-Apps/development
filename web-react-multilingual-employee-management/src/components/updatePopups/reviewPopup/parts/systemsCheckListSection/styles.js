import { makeStyles } from '@material-ui/core/styles';
import {
  TEXT_FONT_SIZE,
  TEXT_FONT_SIZE_LARGE,
  BLUE_COLOR,
} from '../../../../../constants/review-popup';

export const useStyles = makeStyles((theme) => ({
  bigTextArea: { fontSize: '25px' },
  tableCellStyle: {
    // padding: "0 10px",
    padding: 0,
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    // fontSize: TEXT_FONT_SIZE,
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      fontSize: TEXT_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: TEXT_FONT_SIZE_LARGE,
    },
  },
  tableCellForFloorTests: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tableHeaderCellStyle: {
    // padding: "0 10px",
    fontWeight: 'bold',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    // fontSize: TEXT_FONT_SIZE,
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      fontSize: TEXT_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: TEXT_FONT_SIZE_LARGE,
    },
  },
  testName: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px',
    '& > p': {
      marginRight: theme.spacing(1),
      textAlign: 'right',
      // fontSize: TEXT_FONT_SIZE,
      fontWeight: 500,
      [theme.breakpoints.up('sm')]: {
        fontSize: TEXT_FONT_SIZE,
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: TEXT_FONT_SIZE_LARGE,
      },
    },
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
  },
  testIcon: {
    width: '2.8vw',
    height: '2.8vw',
  },
  maxWidth: {
    maxWidth: '15vw',
    width: '15vw',
    // maxWidth: "10s0%",
  },
  photoCell: {
    width: '10vw',
  },
  innerTableCellStyle: {
    padding: '0 5px',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
  },
  rowTitleStyle: {
    maxWidth: '300px',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
  },
  container: {
    // width:'100%',
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    height: '100%',
  },
  option: {
    maxWidth: '120px',
  },
  scrollForValues: {
    display: 'block',
    width: '100%',
    overflowX: 'auto',
  },
  textarea: {
    width: '100%',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
    padding: '0 5px',
  },
  mandatoryPhotoMessage: {
    color: 'red',
    fontSize: '12px',
  },
  styledOptionsList: {
    width: '300px !important',
  },
  MuiTableContainer: {
    width: '100%',
    overflowX: 'unset',
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: '200px',
    },
  },
};

export const deleteIconStyles = {
  fontSize: '40px',
  color: BLUE_COLOR,
  cursor: 'pointer',
};
