import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';

export const StyledButton = withStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: 'rgba(0,145,255,.1)',
      borderRadius: theme.spacing(2),
      color: '#0091ff',
      '&:hover': {
        backgroundColor: 'rgba(0,145,255,.3)',
      },
    },
  }),
)(Button);
