import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';

const MobileWrapper = (props) => {
  const { isOpen, children } = props;

  return (
    <Dialog open={isOpen} fullScreen={true} fullWidth={true}>
      {children}
    </Dialog>
  );
};

export default MobileWrapper;
