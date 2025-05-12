import { makeStyles } from '@material-ui/core/styles';
import {
  CUSTOMERS_PAGE_FONT_SIZE,
  MAX_TAB_CONTENT_HEIGHT,
} from '../../../constants/customers-page';

export const useStyles = makeStyles((theme) => ({
  tableCellStyle: {
    padding: '0 10px',
  },
  tableHeaderCellStyle: {
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
    fontWeight: 600,
    fontSize: CUSTOMERS_PAGE_FONT_SIZE,
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    color: '#4A4A4A',
  },
  maxWidth: {
    maxWidth: '167px',
  },
  tableBodyCellStyle: {
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
    fontWeight: 500,
    fontSize: CUSTOMERS_PAGE_FONT_SIZE,
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    color: '#4A4A4A',
    padding: theme.spacing(1),
  },
  rowTitleStyle: {
    maxWidth: '170px',
  },
  container: {
    // maxHeight: 'calc(100% / 3)',
    display: 'flex',
    flexDirection: 'column-reverse',
    // maxHeight:MAX_TAB_CONTENT_HEIGHT
  },
  option: {
    maxWidth: '120px',
  },
  scrollForValues: {
    display: 'block',
    width: '100%',
    overflowX: 'auto',
  },
  inputs: {
    width: '100%',
    margin: theme.spacing(1),
  },
  cursorPointer: {
    cursor: 'pointer',
  },
}));
