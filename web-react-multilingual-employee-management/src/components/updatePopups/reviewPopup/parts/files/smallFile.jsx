import React, { useState } from 'react';
import { useStyles } from './styles';
// import { API } from "../../../../../../tools/keys/keys";
import { Grid, Typography } from '@material-ui/core';
import DeleteConfirmationPopUp from '../../../../reused-components/DeleteConfirmationPopUp';
import { DecriptionIconForUploadPopup, TrashIcon } from './parts';

const SmallFile = ({ element, deleteFileHandler }) => {
  const { name } = element;
  const classes = useStyles();
  const [isConfirmDeletePopUpOpen, setConfirmDeletePopUpOpen] = useState(false);

  return (
    <Grid container className={classes.smallFileContainer}>
      <span className={classes.link}>
        <DecriptionIconForUploadPopup element={element} />
      </span>
      <Typography className={classes.smallFileName}>{name}</Typography>
      <TrashIcon clickHandler={() => setConfirmDeletePopUpOpen(true)} />
      {isConfirmDeletePopUpOpen ? (
        <DeleteConfirmationPopUp
          okCallback={deleteFileHandler}
          cancelCallback={() => setConfirmDeletePopUpOpen(false)}
          isOpen={isConfirmDeletePopUpOpen}
        />
      ) : null}
    </Grid>
  );
};

export default SmallFile;
