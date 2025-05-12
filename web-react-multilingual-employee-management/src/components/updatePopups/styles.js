import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import Checkbox from '@material-ui/core/Checkbox';

export const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
export const theme = createMuiTheme({
  direction: 'rtl',
});

export const CustomCheckbox = withStyles({
  root: {
    color: '#0091ff',
    padding: '4px',
    '&$checked': {
      color: '#0091ff',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const styles = {
  styledFab: {
    color: 'white',
    width: 20,
    height: 20,
    minHeight: 20,
    position: 'absolute',
    top: 10,
    left: 40,
  },
  styledShowAttachmentsIcon: {
    fontSize: 20,
    color: '#0091ff',
    position: 'absolute',
    top: 10,
    right: 0,
    cursor: 'pointer',
  },
  styledShowAttachmentsIconMobile: {
    fontSize: 30,
    color: '#0091ff',
    // position: "absolute",
    // top: 10,
    // right: 65,
    cursor: 'pointer',
  },
  iconsWrapper: { margin: '0 auto', position: 'relative', bottom: '21px' },
  styledFabMobile: {
    backgroundColor: '#0091ff',
    color: 'white',
    width: 20,
    height: 20,
    minHeight: 20,
    position: 'absolute',
    top: 10,
  },
  mobileLoader: { position: 'relative', height: '100%', width: '100%' },
  styledShowAttachmentsIconNotMetalpress: {
    fontSize: 30,
    color: '#0091ff',
    cursor: 'pointer',
    marginRight: '20px',
  },
};
