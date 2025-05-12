import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './styles';

const FiltersTextInput = (props) => {
  const { handleSearch } = props;
  const classes = useStyles();
  const [text, setText] = useState('');

  const changeHandler = (e) => {
    const { value } = e.target;
    setText(value);
  };
  const handleCancel = () => {
    setText('');
    handleSearch('');
  };

  return (
    <React.Fragment>
      <SearchIcon
        className={text ? `${classes.searchIcon} ${classes.searchIconActive}` : classes.searchIcon}
        onClick={() => handleSearch(text)}
      />
      <TextField value={text} onChange={changeHandler} />
      {text && <i style={{ marginTop: '8px' }} className={`fas fa-times`} onClick={handleCancel} />}
    </React.Fragment>
  );
};

export default FiltersTextInput;
