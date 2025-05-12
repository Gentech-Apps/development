import React from 'react';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  signatureIconRoot: {
    cursor: 'pointer',
    color: `#0091ff !important`,
  },
});

const DigitalSignatureBtn = (props) => {
  const { clickHandler } = props;

  const classes = useStyles();
  return <BorderColorIcon classes={{ root: classes.signatureIconRoot }} onClick={clickHandler} />;
};

export default DigitalSignatureBtn;
