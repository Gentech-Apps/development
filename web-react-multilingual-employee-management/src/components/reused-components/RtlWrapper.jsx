import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { StylesProvider, ThemeProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createMuiTheme({
  direction: 'rtl',
});

const RtlWrapper = (props) => {
  const { children } = props;

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StylesProvider>
  );
};

export default RtlWrapper;
