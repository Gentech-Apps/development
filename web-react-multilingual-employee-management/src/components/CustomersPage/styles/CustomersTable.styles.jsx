import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import { createMuiTheme } from '@material-ui/core/styles';
import { jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { CUSTOMERS_PAGE_FONT_SIZE } from '../../../constants/customers-page';

export const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
export const theme = createMuiTheme({
  direction: 'rtl',
});

export const StyledTableCell = withStyles((theme) =>
  createStyles({
    root: {
      fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
      fontWeight: 500,
      fontSize: CUSTOMERS_PAGE_FONT_SIZE,
      fontWeight: 600,
      color: '#4A4A4A;',
      backgroundColor: '#f7f7f7',
      position: 'sticky',
      zIndex: '990',
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
      top: 0,
      padding: theme.spacing(1),
    },
  }),
)(TableCell);

export const StyledTableRow = withStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.contrastText,
      cursor: 'pointer',
    },
  }),
)(TableRow);

export const StyledPaper = withStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#f7f7f7',
      //  marginBottom: theme.spacing(2),
      //  width: '90%',
      margin: '0 auto',
      position: 'relative',
      height: 'calc(100vh - 100px)' /* should be (100% - header height) */,
      // height:'100%'
    },
  }),
)(Paper);

export const useStyles = makeStyles((theme) => ({
  inputs: {
    width: '100%',
    margin: theme.spacing(1),
  },
  container: {
    // stripe height = 4vh
    maxHeight: `calc(100vh - 112px - 4vh)`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  buttonStyle: {
    position: 'absolute',
    right: 50,
    bottom: 50,
    zIndex: 1000,
    cursor: 'pointer',
    width: 75,
  },
  customersPageWrapper: {
    padding: '10px',
    margin: '10px',
  },
  overflowAuto: {
    overflow: 'auto',
  },
  customersTableCell: {
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
    fontWeight: 500,
    fontSize: CUSTOMERS_PAGE_FONT_SIZE,
    color: '#4A4A4A;',
    padding: theme.spacing(1),
  },
  totalCustomers: {
    color: 'white',
    margin: '0 auto',
    fontWeight: 600,
  },
  editCustomerSectionWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    backgroundColor: '#F7F7F7',
    border: '1px solid #CACBCC',
    borderRadius: '10px',
    marginBottom: theme.spacing(2),
  },
  alignItemsCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  editCustomerTypography: {
    color: '#0091ff',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  goBackButton: {
    backgroundColor: '#0091ff',
    borderRadius: '20px',
    color: '#ffffff',
    fontWeight: '500',
  },
  tabsWrapper: {
    width: 'calc(72% - 8px)',
  },
  tab: {
    padding: '5px',
    border: '1px solid #CACBCC',
    borderLeft: 'none',
  },
  leftTab: {
    padding: '5px',
    border: '1px solid #CACBCC',
    borderTopLeftRadius: '10px',
  },
  rightTab: {
    padding: '5px',
    border: '1px solid #CACBCC',
    borderTopRightRadius: '10px',
    borderLeft: 'none',
  },
  editImage: {
    cursor: 'pointer',
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    cursor: 'pointer',
  },
  customer_page_over: {
    height: 'calc(100vh - 177px)',
    overflowY: 'auto',
  },
}));
