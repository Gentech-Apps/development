import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { CUSTOMERS_PAGE_FONT_SIZE } from '../../../constants/customers-page';

const useStyles = makeStyles((theme) => ({
  styledButton: {
    backgroundColor: '#0091FF',
    borderRadius: '30px',
    padding: '10px 40px',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: CUSTOMERS_PAGE_FONT_SIZE,
    marginLeft: theme.spacing(2),
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
  },
}));

const StyledButton = (props) => {
  const classes = useStyles();
  const { clickHandler, children } = props;
  return (
    <Button variant="contained" className={classes.styledButton} onClick={clickHandler}>
      {children}
    </Button>
  );
};

export default StyledButton;
