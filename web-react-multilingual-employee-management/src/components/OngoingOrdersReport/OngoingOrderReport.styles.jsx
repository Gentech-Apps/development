import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';

export const StyledTableCell = withStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#f7f7f7',
      paddingTop: theme.spacing(8),
    },
  }),
)(TableCell);

export const StyledTableRow = withStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.contrastText,
    },
  }),
)(TableRow);

export const StyledPaper = withStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#f7f7f7',
      marginBottom: theme.spacing(2),
      width: '100%',
    },
  }),
)(Paper);
