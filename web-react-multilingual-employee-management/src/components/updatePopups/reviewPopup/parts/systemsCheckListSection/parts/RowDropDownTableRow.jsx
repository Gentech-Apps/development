import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import { useStyles } from '../styles';

const RowDropDownTableRow = ({ link, rowIdx, colIdx, removeFileHandler }) => {
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell className={classes.innerTableCellStyle} align="center">
        <DeleteForeverOutlinedIcon
          className={classes.cursorPointer}
          onClick={(e) => removeFileHandler(rowIdx, colIdx, link)}
          color="error"
        />
      </TableCell>
      {/* <TableCell className={classes.innerTableCellStyle} align="center">
        <a href={link} target = 'blank'>Link</a>
      </TableCell> */}
      <TableCell className={classes.innerTableCellStyle} align="center">
        <a href={link} target="blank">
          <img src={link} alt="..." style={{ width: '25px', height: '25px' }} />
        </a>
      </TableCell>
    </TableRow>
  );
};

export default RowDropDownTableRow;
