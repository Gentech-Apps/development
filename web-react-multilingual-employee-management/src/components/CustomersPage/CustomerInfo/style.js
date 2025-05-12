import { makeStyles } from '@material-ui/core';
import { CUSTOMERS_PAGE_FONT_SIZE } from '../../../constants/customers-page';

export const useStyles = makeStyles((theme) => ({
  infoTablePaper: {
    width: 'calc(28% - 8px)',
    height: 'fit-content',
  },
  genericTableCell: {
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
    fontSize: CUSTOMERS_PAGE_FONT_SIZE,
    borderBottom: '0px solid rgba(224, 224, 224, 1)',
    color: '#4A4A4A;',
  },
  headerCell: {
    backgroundColor: '#F7F7F7',
  },
  boldCell: {
    fontWeight: 600,
  },
  plainCell: {
    fontWeight: 500,
  },
}));
