import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DIALOG_BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/review-popup';

const styles = (theme) => ({
  dialogTitleRoot: {
    margin: 0,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: DIALOG_BACKGROUND_COLOR,
    textAlign: 'center',
  },
  dialogTitleText: {
    color: TEXT_COLOR,
    fontSize: '1.5rem',
    lineHeight: '1.5',
    fontWeight: '600',
  },
});
// added inline style because of withStyles position right was changed to left
const dialogTitleCloseButtonStyle = {
  position: 'absolute',
  right: '8px',
  top: '8px',
  color: TEXT_COLOR,
};

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.dialogTitleRoot} {...other}>
      <Typography variant="h6" classes={{ root: classes.dialogTitleText }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton style={dialogTitleCloseButtonStyle} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default DialogTitle;
