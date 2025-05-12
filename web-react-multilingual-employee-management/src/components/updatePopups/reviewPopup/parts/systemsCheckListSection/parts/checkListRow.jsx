import React, { useCallback } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '../styles';
import RowDropDown from './RowDropDown';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CHECK_LIST_TRANSLATION } from '../../../../../../constants/translations/customersPage';
import StyledCheckbox from '../../../../../reused-components/StyledCheckbox';
import { MULTIPLE_VALUES } from '../../../../../../constants/customers-page';
import CustomizedAddIcon from '../../../reusableComponents/customizedAddIcon';
import { CheckListService } from '../services';
import _ from 'lodash';
import { useState } from 'react';
import { useEffect } from 'react';

const CheckListRow = (props) => {
  const classes = useStyles();
  const {
    row,
    rowIdx,
    setValueHandler,
    uploadPhotoHandler,
    removeFileHandler,
    setRowTitle,
    getTestsPerFloor,
    orderId,
    // orderId, actualSystemId
  } = props;

  let { message } = row;
  const [imageStatus, setImageStatus] = useState(false);

  useEffect(() => {
    if (message) {
      setImageStatus((prev) => !prev);
      setTimeout(() => {
        setImageStatus((prev) => !prev);
        message = undefined;
        delete row.message;
      }, 30000);
    }
  }, [message]);

  const { PROPER, IMAGE_MUST_BE_ADDED } = CHECK_LIST_TRANSLATION;

  const getPhotoMandatoryMessage = useCallback((row) => {
    const PROPER_NOT_PROPER_COLUMN_INDEX = 0;
    const PHOTO_COLUMN_INDEX = 3;
    const isProperValue = row?.values[PROPER_NOT_PROPER_COLUMN_INDEX].value;
    const photoValue = row?.values[PHOTO_COLUMN_INDEX].value;
    if (isProperValue && isProperValue !== PROPER && !photoValue.length) {
      return IMAGE_MUST_BE_ADDED;
    }
  }, []);

  const createOptions = useCallback((options) => {
    const result = options?.map((i) => i.option) || [];
    return _.compact(result);
  }, []);

  const openAdditionalCheckListHandler = useCallback((test) => {
    const { test_union, row_title } = test;
    if (test_union) {
      setRowTitle(row_title);
    }
  }, []);

  const openTestPerFloorHandler = useCallback((test) => {
    getTestsPerFloor(test, orderId, rowIdx);
  }, []);

  const formatValue = (input) => {
    // format value for multiple value (if string push into empty array), where input number  >= 0
    const { typeOfInput, value } = input;
    if (typeOfInput >= MULTIPLE_VALUES) {
      return value ? (typeof value === 'string' ? [value] : value) : [];
    }
    return value || '';
  };

  return (
    <TableRow>
      <TableCell
        className={`${classes.tableCellStyle}`}
        onClick={() => {
          row.test_union && openAdditionalCheckListHandler(row);
          row.test_per_floor_id && openTestPerFloorHandler(row);
        }}
        style={CheckListService.setRowTitleActive(row)}
      >
        <span className={classes.testName} style={{ padding: row.test_union ? '16px 0' : '0' }}>
          <img src={row.icon} className={classes.testIcon} />
          <p style={CheckListService.setRowTitleColor(row)}>{row.row_title}</p>
        </span>
      </TableCell>
      {row.values &&
        row.values.map((i, colIdx) => {
          return colIdx !== row.values.length - 1 /*temporary excluded last field from showing*/ ? (
            <TableCell className={classes.tableCellStyle} key={i._id} align="center">
              {i.typeOfInput === 'number' ? (
                <TextField
                  placeholder={i.placeholder}
                  type={'number'}
                  value={i.value}
                  className={classes.maxWidth}
                  onChange={(e) => setValueHandler(rowIdx, colIdx, e.target.value)}
                />
              ) : i.typeOfInput === 'photo' ? (
                <Grid className={classes.photoCell}>
                  <p className={classes.mandatoryPhotoMessage}>{getPhotoMandatoryMessage(row)}</p>
                  {imageStatus && <p className={classes.mandatoryPhotoMessage}>{message}</p>}
                  <Grid container direction="row" justify="space-evenly" alignItems="center">
                    {`${i?.value?.length}`}
                    <label>
                      <TextField
                        style={{ display: 'none' }}
                        type="file"
                        onChange={(e) => uploadPhotoHandler(rowIdx, colIdx, e.target)}
                      />
                      <CustomizedAddIcon clickHandler={() => ({})} />
                    </label>
                    <RowDropDown
                      rowIdx={rowIdx}
                      colIdx={colIdx}
                      removeFileHandler={removeFileHandler}
                      values={i.value}
                    />
                  </Grid>
                </Grid>
              ) : parseInt(i.typeOfInput) ? (
                <Autocomplete
                  className={colIdx === 1 ? classes.maxWidth : ''}
                  classes={{ popper: classes.styledOptionsList }}
                  size="small"
                  freeSolo
                  multiple={parseInt(i.typeOfInput) >= MULTIPLE_VALUES}
                  options={createOptions(i?.options)}
                  getOptionLabel={(option) =>
                    option && typeof option === 'string' ? option : option?.join?.() || ''
                  }
                  // value={(i?.value?.length) ? i?.value : []}
                  value={formatValue(i)}
                  onChange={(e, value) => setValueHandler(rowIdx, colIdx, value)}
                  renderInput={(params) => (
                    <TextField
                      padding="dense"
                      {...params}
                      variant="standard"
                      InputProps={{ ...params.InputProps, disableUnderline: true }}
                    />
                  )}
                />
              ) : i.typeOfInput === 'text' ? (
                <TextField
                  multiline
                  rows={4}
                  placeholder={i.placeholder}
                  value={i.value}
                  onChange={(e) => setValueHandler(rowIdx, colIdx, e.target.value)}
                  InputProps={{ disableUnderline: true }}
                />
              ) : i.typeOfInput === 'checkbox' ? (
                <StyledCheckbox
                  checked={i.value}
                  changeHandler={(e) => setValueHandler(rowIdx, colIdx, e.target.checked)}
                />
              ) : i.typeOfInput === 'read' ? (
                <p className={classes.maxWidth}>{i.value}</p>
              ) : null}
            </TableCell>
          ) : null;
        })}
    </TableRow>
  );
};

export default CheckListRow;
