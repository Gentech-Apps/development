import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import '../../../../../../../../sass/percentSelect/percentSelect.scss';
import { polyfill } from 'es6-promise';
polyfill();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: 60,
  },
  inputField: {
    width: 60,
  },
}));

function PrecentSelect(props) {
  const classes = useStyles();
  const [percent, setPercent] = useState(props.step.percent);

  const handleChange = (event) => {
    if (
      props.form_data.transaction_value === undefined ||
      props.is_disabled_for_transaction_value
    ) {
      return;
    }

    setPercent(event.target.value);
    props.updateStepObj('percent', event.target.value.trim());
  };

  const checkTransactionValue = () => {
    if (
      props.form_data.transaction_value === undefined ||
      props.is_disabled_for_transaction_value
    ) {
      props.showValidateMessage();
      props.changeDisabledForTransactionValue(true);

      return;
    } else {
      props.hideValidateMessage();
    }
  };

  return (
    <div className={classes.root}>
      <div style={props.step.name === 'מיוחדת' ? { pointerEvents: 'none' } : {}}>
        <FormControl fullWidth className={classes.margin}>
          <Input
            id="standard-adornment-precent"
            disabled={props.is_disabled ? true : false}
            // disabled={true}
            value={percent}
            className={classes.inputField}
            type="text"
            onChange={handleChange}
            onClick={checkTransactionValue}
            startAdornment={<InputAdornment position="start">%</InputAdornment>}
          />
        </FormControl>
      </div>
    </div>
  );
}

export default PrecentSelect;
