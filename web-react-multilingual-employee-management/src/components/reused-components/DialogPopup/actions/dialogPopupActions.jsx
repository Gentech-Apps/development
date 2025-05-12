import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { DIALOG_BACKGROUND_COLOR } from '../../../../constants/review-popup';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: DIALOG_BACKGROUND_COLOR,
  },
}))(MuiDialogActions);

export default DialogActions;
