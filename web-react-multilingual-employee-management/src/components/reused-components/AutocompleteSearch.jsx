import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

const AutocompleteSearch = (props) => {
  const {
    setValueHandler,
    options,
    value,
    disabled,
    initValidation,
    setError,
    clearError,
    name,
  } = props;
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    if (initValidation && !value) {
      setValidationError(true);
      setError(name);
    } else if (value) {
      setValidationError(false);
      clearError(name);
    }
  }, [initValidation, value]);

  const changeHandler = (event, newValue) => {
    if (typeof newValue === 'string') {
      setValueHandler({
        name: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setValueHandler({
        name: newValue.inputValue,
      });
    } else {
      setValueHandler(newValue);
    }
  };

  const filterHandler = (options, params) => {
    const filtered = filter(options, params);

    // Suggest the creation of a new value
    if (params.inputValue !== '') {
      filtered.push({
        inputValue: params.inputValue,
        name: `${params.inputValue}`,
      });
    }

    return filtered;
  };

  const getLabelHandler = (option) => {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option.name;
  };

  return (
    <Autocomplete
      disabled={disabled}
      value={value}
      onChange={changeHandler}
      filterOptions={filterHandler}
      options={options}
      getOptionLabel={getLabelHandler}
      renderOption={(option) => option.name}
      fullWidth
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      style={{ backgroundColor: '#f9f9f9' }}
      renderInput={(params) => (
        <TextField {...params} size="small" variant="outlined" error={validationError} />
      )}
    />
  );
};

export default AutocompleteSearch;
