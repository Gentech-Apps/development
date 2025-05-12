import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import { useStyles } from './styles';
import File from './file';
import SmallFile from './smallFile';
import { deleteAttachment } from '../../../functions/api/customer-page';
import { useDispatch } from 'react-redux';
import { setCustomerData } from '../../../actions/customers_table_actions';

const Files = (props) => {
  const { customerId, files, isSmall, deleteFileFromUploadPopupHandler } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const deleteFileHandler = useCallback(async (customerId, fileId) => {
    const { ok, result } = await deleteAttachment(customerId, fileId);
    if (ok && result) {
      dispatch(setCustomerData(result));
    }
  }, []);

  return (
    <Box container={'true'} className={classes.filesHolder}>
      {files?.map?.((i, idx) =>
        isSmall ? (
          <SmallFile
            key={`${i.name} + ${i.size}`}
            element={i}
            deleteFileHandler={() => deleteFileFromUploadPopupHandler(idx)}
          />
        ) : (
          <File
            key={i._id}
            element={i}
            deleteFileHandler={() => deleteFileHandler(customerId, i._id)}
          />
        ),
      )}
    </Box>
  );
};

export default Files;
