import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Box } from '@material-ui/core';
import { useDataUpload } from '../../../../hooks/useDataUpload';
import DescriptionIcon from '@material-ui/icons/Description';
import { useStyles } from './styles';
import { API } from '../../../../tools/keys/keys';

const Attachment = ({ element }) => {
  const { original_name, path } = element;
  const classes = useStyles();

  return (
    <span className={`${classes.fileContainer}`}>
      <p>{original_name}</p>
      <a href={`${API + path}`} className={classes.link} target="blank">
        <DescriptionIcon />
      </a>
    </span>
  );
};

export default Attachment;
