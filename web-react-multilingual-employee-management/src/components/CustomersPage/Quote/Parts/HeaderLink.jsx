import React from 'react';
import { useStyles, navLinkStyle, activeLink } from '../styles';
import { NavLink } from 'react-router-dom';

const AddProductHeaderLink = (props) => {
  const { label, icon, path } = props;
  const classes = useStyles();
  return (
    <NavLink
      to={path}
      className={classes.buttonWithIcon}
      style={navLinkStyle}
      activeStyle={activeLink}
    >
      {icon}
      <h3 className={classes.buttonWitIconText}>{label}</h3>
    </NavLink>
  );
};

export default AddProductHeaderLink;
