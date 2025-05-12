import { withStyles, Button } from '@material-ui/core';

export const CustomButton = withStyles({
  root: {
    whiteSpace: 'nowrap',
    width: '200px',
    backgroundColor: '#0091ff',
    borderColor: '#0091ff',
    '&:hover': {
      backgroundColor: '#40acff',
    },
    fontFamily: 'Rubik',
    fontSize: '14px',
    lineHeight: 'normal',
    borderRadius: '100px',
    fontWeight: '100',
  },
})(Button);
