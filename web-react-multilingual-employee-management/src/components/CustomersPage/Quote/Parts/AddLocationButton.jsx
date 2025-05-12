import React from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { QUOTE } from '../../../../constants/translations/customersPage';
import { useStyles, defaultColor, disabled } from '../styles';

const AddLocationButton = (props) => {
  const { addLocationHandler, readOnly } = props;
  const classes = useStyles();
  const { ADD_LOCATION } = QUOTE;
  return (
    <div className={classes.buttonWithIcon}>
      <AddCircleOutlineIcon
        style={readOnly ? disabled : defaultColor}
        onClick={readOnly ? () => {} : addLocationHandler}
      />
      <p className={classes.buttonWitIconText}>{ADD_LOCATION}</p>
    </div>
  );
};

export default AddLocationButton;
