import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { uploadFile } from '../../../../functions/api/customer-page';
import { useStyles } from './styles';
import { SmallLoader } from '../../../reused-components/SmallLoader';

const FileInput = (props) => {
  const classes = useStyles();
  const { customerId, updateFilesList } = props;
  const [pending, setPending] = useState(false);

  const uploadFileHandler = async (element, customerId) => {
    const file = element.files[0];
    const formData = new FormData();
    formData.append('file', element.files[0]);
    setPending(true);
    const { ok, result } = await uploadFile(formData, customerId);
    if (ok && result) {
      setPending(false);
      updateFilesList(result?.attachments);
    }
  };

  return pending ? (
    <div className={classes.loaderWrapper}>
      <SmallLoader />
    </div>
  ) : (
    <label className={classes.fileInputHolder}>
      <TextField
        style={{ display: 'none' }}
        type="file"
        onChange={(e) => uploadFileHandler(e.target, customerId)}
      />
      <Fab
        size="small"
        component="span"
        style={{
          backgroundColor: '#0091ff',
          color: 'white',
          width: 30,
          height: 30,
          minHeight: 30,
        }}
      >
        <AddIcon style={{ fontSize: 30 }} />
      </Fab>
    </label>
  );
};

export default FileInput;
