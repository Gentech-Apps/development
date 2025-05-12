import React from 'react';
import { useStyles, disabled } from '../styles';
import { QUOTE } from '../../../../constants/translations/customersPage';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveLocation, setQuoteInfoWasUpdated } from '../../../../actions/quotation-actions';
import { updateQuoteInfo } from '../../../../functions/api/customer-page';

const AddProductButton = (props) => {
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const wasQuoteInfoChanged = useSelector((state) => state.quotationManagement.wasQuoteInfoChanged);
  const quoteInfo = useSelector((state) => state.quotationManagement.quoteInfo);
  const { customerId, quoteId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { identifier, locations, location, readOnly } = props;
  const { ADD_PRODUCT } = QUOTE;
  const classes = useStyles();

  const addNewProductHandler = () => {
    if (wasQuoteInfoChanged) {
      updateQuoteInfo(quoteInfo);
      dispatch(setQuoteInfoWasUpdated(false));
    }
    dispatch(setActiveLocation({ locations, currentLocationIndex: identifier }));
    history.push(
      `/${factoryName}/customers-page/create-product/${customerId}/${quoteId}/${location}`,
    );
  };
  return (
    <div
      className={classes.addProductButton}
      style={readOnly ? disabled : {}}
      onClick={readOnly ? () => {} : addNewProductHandler}
    >
      <h3 className={classes.addButtonInnerText}>{ADD_PRODUCT}</h3>
    </div>
  );
};

export default AddProductButton;
