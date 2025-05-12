import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { ICON_WIDTH, ICON_WIDTH_MEDIUM } from '../../constants/review-popup';

export const useStyles = makeStyles((theme) => ({
  styledCheckbox: {
    color: '#0091ff !important',
    '& .MuiSvgIcon-root': {
      // fontSize: ICON_WIDTH
      [theme.breakpoints.up('sm')]: {
        fontSize: ICON_WIDTH,
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: ICON_WIDTH_MEDIUM,
      },
    },
  },
}));

const StyledCheckbox = (props) => {
  const { checked, changeHandler } = props;
  const classes = useStyles();
  return (
    <Checkbox
      className={classes.styledCheckbox}
      checked={checked}
      onClick={changeHandler}
      // disabled
    />
  );
};

export default StyledCheckbox;
