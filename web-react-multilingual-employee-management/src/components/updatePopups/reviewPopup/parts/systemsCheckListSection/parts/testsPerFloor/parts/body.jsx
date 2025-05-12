import React, { useCallback } from 'react';
import { TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { useStyles, deleteIconStyles } from '../../../styles';
import { CHECK_LIST_TRANSLATION } from '../../../../../../../../constants/translations/customersPage';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
const { PROPER, NOT_PROPER } = CHECK_LIST_TRANSLATION;

const TestsPerFloorTableBody = (props) => {
  const { data, deleteRow, tests, setTestsPerFloor } = props;
  const classes = useStyles();

  const setValueHandler = useCallback(
    (rowId, colIdx, value) => {
      const testsCopy = { ...tests };
      const currentRow = testsCopy.data.find(({ _id }) => _id === rowId);
      currentRow.values[colIdx].value = value;
      const activeValue = currentRow.values[colIdx];
      const { high_limit, low_limit } = activeValue;
      if (high_limit && low_limit) {
        const fieldForConclusion = currentRow.values.find((i) => i.test_conclusion);
        const highLimit = parseFloat(high_limit);
        const lowLimit = parseFloat(low_limit);
        const parsedValue = parseFloat(value);
        const valueOk = parsedValue <= highLimit && parsedValue >= lowLimit;
        const status = valueOk ? PROPER : NOT_PROPER;
        fieldForConclusion.value = status;
      }
      setTestsPerFloor(testsCopy);
    },
    [tests],
  );

  return (
    <TableBody>
      {data?.map((row) => {
        const { values } = row;
        const rowId = row._id;
        return (
          <TableRow key={rowId}>
            <TableCell align="center" className={classes.tableCellStyle}>
              <DeleteForeverOutlinedIcon
                onClick={() => deleteRow(rowId)}
                style={deleteIconStyles}
              />
            </TableCell>
            {values
              ? values?.map((i, colIdx) => {
                  const { value, test_conclusion, input_type } = i;
                  return (
                    <TableCell
                      key={colIdx}
                      align="right"
                      className={`${classes.tableCellStyle} ${classes.tableCellForFloorTests}`}
                    >
                      <TextField
                        rows={2}
                        value={value}
                        type={input_type}
                        onChange={(e) =>
                          test_conclusion
                            ? () => ({})
                            : setValueHandler(rowId, colIdx, e.target.value)
                        }
                        InputProps={{
                          disableUnderline: true,
                          classes: { input: classes.bigTextArea },
                        }}
                      />
                    </TableCell>
                  );
                })
              : null}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default TestsPerFloorTableBody;
