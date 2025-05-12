import React, { useState, useEffect } from 'react';
import { useStyles } from '../styles';
import { QUOTE } from '../../../../constants/translations/customersPage';
import { useDispatch } from 'react-redux';
import { setTotalProductsQuantity, setTotalAmount } from '../../../../actions/quotation-actions';

const TotalAmount = (props) => {
  const { locations } = props;
  const { TOTAL, SHEKEL } = QUOTE;
  const classes = useStyles();
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const totalSumma = locations
      ?.reduce(
        (summa, i) =>
          summa + i?.products?.reduce((total, y) => total + (y.total_cost ? +y.total_cost : 0), 0),
        0,
      )
      ?.toFixed('2');
    const totalQuantity = locations?.reduce(
      (summa, i) =>
        summa + i?.products?.reduce((total, y) => total + (y.quantity ? +y.quantity : 0), 0),
      0,
    );
    setValue(totalSumma);
    dispatch(setTotalAmount(totalSumma));
    dispatch(setTotalProductsQuantity(totalQuantity));
  }, [locations]);

  return (
    <div className={`${classes.buttonWithIcon}`}>
      <h3 className={classes.totalAmountFontSize}>{TOTAL}</h3>
      <h3 className={`${classes.buttonWitIconText} ${classes.totalAmountFontSize}`}>
        {SHEKEL + (value || 0)}
      </h3>
    </div>
  );
};

export default TotalAmount;
