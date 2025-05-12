import React from 'react';
// import editIcon from '../../../../images/reviewPopup/edit.svg'
import { Typography, Grid } from '@material-ui/core';
import { useStyles } from './styles';
import CustomizedEditIcon from './editIcon';

const EditTechnicianButton = (props) => {
  const { clickHandler, technicians } = props;
  const classes = useStyles();
  return (
    <Grid className={classes.editResourceWrapper}>
      <Typography variant="h6" classes={{ root: classes.textRoot }}>
        {technicians}
      </Typography>
      <CustomizedEditIcon clickHandler={clickHandler} />
    </Grid>
  );
};

export default EditTechnicianButton;
