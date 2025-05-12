import React from 'react';
import { setQuoteInfoWasUpdated } from '../../../../actions/quotation-actions';
import { CUSTOMERS_PAGE } from '../../../../constants/translations/customersPage';
import { useDispatch } from 'react-redux';
import CustomizedTextArea from '../../reused_components/inputs/CustomizedTextArea';

const RemarksField = (props) => {
  const dispatch = useDispatch();
  const { value, changeHandler, disabled } = props;
  const { REMARKS } = CUSTOMERS_PAGE;

  const updateRemarksHandler = (value) => {
    changeHandler(value);
    dispatch(setQuoteInfoWasUpdated(true));
  };

  return (
    <CustomizedTextArea
      label={REMARKS}
      value={value}
      changeHandler={updateRemarksHandler}
      width={12}
      height={4}
      disabled={disabled}
    />
  );
};

export default RemarksField;
