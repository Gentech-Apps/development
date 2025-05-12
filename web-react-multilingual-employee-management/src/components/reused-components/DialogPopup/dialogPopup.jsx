import React from 'react';
import { Dialog, makeStyles } from '@material-ui/core';
import DialogTitle from './title/dialogPopUpHeader';
import DialogActions from './actions/dialogPopupActions';
import DialogContent from './content/dialogPopUpContent';

const useStyles = makeStyles((theme) => ({
  dialogRoot: {
    padding: theme.spacing(0),
    margin: theme.spacing(0),
    margin: '0  auto',
  },
  paperFullScreen: {
    maxHeight: '100vh',
    // height: 'auto'
  },
}));

const DialogPopup = (props) => {
  const classes = useStyles();

  const {
    handleClose,
    isOpen = true,
    title = '',
    actions,
    content,
    contentStyle = {},
    width: selectedWidth,
    height: selectedHeight,
  } = props;

  return (
    <Dialog
      classes={{ root: classes.dialogRoot, paperFullScreen: classes.paperFullScreen }}
      onClose={handleClose}
      disableScrollLock
      open={isOpen}
      fullScreen={true}
      PaperProps={{ style: { width: selectedWidth || '', height: selectedHeight || '' } }}
      onClick={(e) => e.stopPropagation()}
    >
      {title && title.length > 0 && <DialogTitle onClose={handleClose}>{title}</DialogTitle>}
      <DialogContent style={contentStyle}>{content}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default DialogPopup;
