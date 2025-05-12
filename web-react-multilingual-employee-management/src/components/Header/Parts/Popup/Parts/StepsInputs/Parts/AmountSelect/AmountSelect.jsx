import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import '../../../../../../../../sass/amountSelect/amountSelect.scss';
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
    width: 80,
  },
  inputField: {
    width: 80,
  },
}));

function AmountSelect(props) {
  const classes = useStyles();
  const [amount, setAmount] = useState(props.step.amount);

  const handleChange = (event) => {
    if (
      props.form_data.transaction_value === undefined ||
      props.is_disabled_for_transaction_value
    ) {
      return;
    }

    setAmount(event.target.value);
    props.updateStepObj('amount', event.target.value.trim());
  };

  useEffect(() => {
    setAmount(props.step.amount);
  }, [props.step.amount]);

  const amountCalc = () => {
    console.log(props.selected_precent);
    if (props.form_data.transaction_value !== undefined && props.selected_precent) {
      let result = (props.selected_precent / 100) * props.form_data.transaction_value;

      if (!Number.isInteger(Number(result))) {
        return Number(result).toFixed(2).toString();
      } else {
        return result;
      }
    } else {
      if (!Number.isInteger(Number(amount))) {
        return Number(amount).toFixed(2).toString();
      } else {
        return amount;
      }
    }
    // Number(result).toFixed(2).toString()
  };

  return (
    <div className={classes.root} id="amount" onClick={props.hideValidateMessage}>
      <div>
        <FormControl fullWidth className={classes.margin}>
          <Input
            id="standard-adornment-amount"
            disabled={true}
            value={amountCalc()}
            className={classes.inputField}
            type="text"
            endAdornment={<InputAdornment position="start">₪</InputAdornment>}
          />
        </FormControl>
      </div>
    </div>
  );
}

export default AmountSelect;
