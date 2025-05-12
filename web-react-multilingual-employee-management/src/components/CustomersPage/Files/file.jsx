import React, { useState } from 'react';
import { useStyles } from './styles';
import { API } from '../../../tools/keys/keys';
import { Grid, Typography } from '@material-ui/core';
import DeleteConfirmationPopUp from '../../reused-components/DeleteConfirmationPopUp';
import { StyledDecriptionIcon, TrashIcon } from './parts';

const File = ({ element, deleteFileHandler }) => {
  const { original_name, path } = element;
  const classes = useStyles();
  const [isConfirmDeletePopUpOpen, setConfirmDeletePopUpOpen] = useState(false);

  return (
    <Grid container className={classes.fileContainer}>
      <TrashIcon clickHandler={() => setConfirmDeletePopUpOpen(true)} />
      <Typography className={classes.fileName}>{original_name}</Typography>
      <a href={`${API + path}`} className={classes.link} target="blank">
        <StyledDecriptionIcon element={element} />
      </a>
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

export default File;
