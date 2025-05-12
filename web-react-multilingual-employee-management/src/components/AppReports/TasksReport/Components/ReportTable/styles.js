import { createMuiTheme } from '@material-ui/core/styles';
import { jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { makeStyles } from '@material-ui/core/styles';

export const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
export const theme = createMuiTheme({
  direction: 'rtl',
});

export const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 'calc(100vh - 160px)',
  },
});
