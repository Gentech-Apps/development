import React, { useCallback, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useStyles } from './styles';
import File from './file';
import SmallFile from './smallFile';
import { deleteAttachment } from '../../../../../functions/api/customer-page';

const Files = (props) => {
  const { customerId, files, setFiles, isSmall, deleteFileFromUploadPopupHandler } = props;
  const classes = useStyles();

  const deleteFileHandler = useCallback(
    (customerId, fileId) => async () => {
      const responce = await deleteAttachment(customerId, fileId);
      const files = responce?.result?.attachments || [];
      setFiles(files);
    },
    [],
  );

  return (
    <Box container={'true'} p={3} className={classes.filesHolder}>
      {files?.map?.((i, idx) =>
        isSmall ? (
          <SmallFile
            key={`${i.name} + ${i.size}`}
            element={i}
            deleteFileHandler={() => deleteFileFromUploadPopupHandler(idx)}
          />
        ) : (
          <File key={i._id} element={i} deleteFileHandler={deleteFileHandler(customerId, i._id)} />
        ),
      )}
    </Box>
  );
};

export default Files;
