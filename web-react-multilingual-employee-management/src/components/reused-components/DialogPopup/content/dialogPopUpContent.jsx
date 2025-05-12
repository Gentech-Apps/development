import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogContent from '@material-ui/core/DialogContent';

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: 0,
    minHeight: '50vh',
    overflowX: 'hidden',
  },
}))(MuiDialogContent);

export default DialogContent;
