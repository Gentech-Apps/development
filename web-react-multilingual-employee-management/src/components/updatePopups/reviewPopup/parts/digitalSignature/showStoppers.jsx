import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import uuid from 'uuid';
import { DIALOG_BACKGROUND_COLOR } from '../../../../../constants/review-popup';

const EDITORIAL_BOARD = 'מערכת';
const OUTCOME = 'תוצאה';

const useStyles = makeStyles((theme) => ({
  cell: {
    fontSize: '18px',
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
  },
  headerCell: {
    fontWeight: 600,
    backgroundColor: `${DIALOG_BACKGROUND_COLOR} !important`,
  },
  rowCell: {
    fontWeight: 500,
  },
}));

const ShowStoppersList = (props) => {
  const { badSystemsList } = props;

  const classes = useStyles();

  return (
    <TableContainer component={Paper} style={{ width: 'calc(100% - 10px)', boxShadow: '0px' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="right" className={`${classes.cell} ${classes.headerCell}`}>
              {EDITORIAL_BOARD}
            </TableCell>
            <TableCell align="right" className={`${classes.cell} ${classes.headerCell}`}>
              {OUTCOME}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {badSystemsList.map((system) => {
            const { system_name, show_stopper, actual_system_name } = system;
            return (
              <TableRow key={uuid()}>
                <TableCell
                  align="right"
                  className={`${classes.cell} ${classes.rowCell}`}
                >{`${system_name} ${actual_system_name}`}</TableCell>
                <TableCell align="right" className={`${classes.cell} ${classes.rowCell}`}>
                  {show_stopper}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShowStoppersList;
