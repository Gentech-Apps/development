import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { QUOTATION_HISTORY_TABLE } from '../../../../constants/translations/customersPage';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { useStyles } from '../../styles/StylesForTables';
const { QUOTE_NUMBER, TOTAL_QUOTE, STATUS, ISSUE_DATE } = QUOTATION_HISTORY_TABLE;

const HEAD_CELLS = [
  { id: 'number', label: QUOTE_NUMBER },
  { id: 'total_number', label: TOTAL_QUOTE },
  { id: 'status', label: STATUS },
  { id: 'date', label: ISSUE_DATE },
];

const QuotationHistoryTableHead = (props) => {
  const classes = useStyles();
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {HEAD_CELLS.map((headCell) => (
          <TableCell
            size="medium"
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.tableHeaderCellStyle}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default QuotationHistoryTableHead;
