import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import RowDropDownTableRow from './RowDropDownTableRow';
import RowDropDownTableHead from './RowDropDownTableHead';

function RowDropDown(props) {
  const { rowIdx, colIdx, values, removeFileHandler } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box margin={1}>
          <Table size="small">
            {/* RowDropDownTableHead should be deleted as unnecessary */}
            {/* <RowDropDownTableHead /> */}
            <TableBody>
              {values &&
                values.map((i, idx) => (
                  <RowDropDownTableRow
                    key={i}
                    link={i}
                    colIdx={colIdx}
                    rowIdx={rowIdx}
                    removeFileHandler={removeFileHandler}
                  />
                ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </>
  );
}

export default RowDropDown;
