import React from 'react';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import RowDropDown from '../../systemsCheckListSection/parts/RowDropDown';
import { CHECK_LIST_TRANSLATION } from '../../../../../../constants/translations/customersPage';
import { useStyles } from '../styles';

const InputPhotoMobile = ({ rowIdx, colIdx, item, changeHandler, removeHandler, row }) => {
  const { PROPER, IMAGE_MUST_BE_ADDED } = CHECK_LIST_TRANSLATION;
  const classes = useStyles();

  const getPhotoMandatoryMessage = (row) => {
    const PROPER_NOT_PROPER_COLUMN_INDEX = 0;
    const PHOTO_COLUMN_INDEX = 3;
    const isProperValue = row[PROPER_NOT_PROPER_COLUMN_INDEX].value;
    const photoValue = row[PHOTO_COLUMN_INDEX].value;
    if (isProperValue && isProperValue !== PROPER && !photoValue.length) {
      return IMAGE_MUST_BE_ADDED;
    }
  };

  return (
    <Grid container direction="row" justify="space-evenly" alignItems="center">
      <p className={classes.mandatoryPhotoMessage}>{getPhotoMandatoryMessage(row)}</p>
      {`${item.value && item.value.length}`}
      <label>
        <TextField
          style={{ display: 'none' }}
          type="file"
          onChange={(e) => changeHandler(colIdx, rowIdx, e.target)}
        />
        <Fab
          color="primary"
          size="small"
          component="span"
          aria-label="add"
          style={{
            width: 20,
            height: 20,
            minHeight: 20,
          }}
        >
          <AddIcon style={{ fontSize: 20 }} />
        </Fab>
      </label>
      <RowDropDown
        rowIdx={colIdx}
        colIdx={rowIdx}
        removeFileHandler={removeHandler}
        values={item.value}
      />
    </Grid>
  );
};

export default InputPhotoMobile;
