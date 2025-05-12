import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useDataUpload } from '../../../../hooks/useDataUpload';
import { useStyles } from './styles';
import Attachment from './Attachment';
import FileInput from './FileInput';
import { useFiles } from '../../../../hooks/useFiles';

const Attachments = (props) => {
  const { closeHandler, customerId } = props;
  const classes = useStyles();

  const [filesList, setFilesList] = useFiles(customerId);

  return (
    <div style={{ display: 'block', padding: '10px' }}>
      <FileInput customerId={customerId} updateFilesList={setFilesList} />
      <Box container={'true'} p={3} className={classes.filesHolder}>
        {filesList?.map?.((i) => (
          <Attachment key={i._id} element={i} />
        ))}
      </Box>
      <Box container={'true'} p={3} className={classes.backLinkWrapper}>
        <p onClick={closeHandler} className={classes.backLink}>
          חזרה למערכות
        </p>
      </Box>
    </div>
  );
};

export default Attachments;
