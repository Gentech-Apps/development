import React, { useState, useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import { useStyles, defaultColor } from '../styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const Location = (props) => {
  const { changeLocationValueHandler, value, identifier, products } = props;
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  const doLocationHaveProducts = !!products.length;
  return (
    <ClickAwayListener onClickAway={() => setEditing(false)}>
      <div
        className={classes.buttonWithIcon}
        onClick={() => setEditing(doLocationHaveProducts ? false : true)}
      >
        {editing || !value ? (
          <TextField
            className={classes.buttonWitIconText}
            onChange={(e) => changeLocationValueHandler(identifier, e.target.value)}
            value={value}
          />
        ) : (
          <p className={classes.buttonWitIconText}>{value}</p>
        )}
        {doLocationHaveProducts ? null : <EditIcon style={defaultColor} />}
      </div>
    </ClickAwayListener>
  );
};

export default Location;
