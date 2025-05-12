import React from 'react';
import { CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import { useSelector } from 'react-redux';
import { setCustomerInfo } from '../../../actions/quotation-actions';
import { useDispatch } from 'react-redux';
import { createQuote } from '../../../functions/api/customer-page';
import { QUOTE } from '../../../constants/translations/customersPage';
import { useHistory } from 'react-router-dom';
import CreateButton from '../reused_components/CreateButton';

const CreateQuoteButton = () => {
  const history = useHistory();
  const { DRAFT } = QUOTE;
  const { CREATE_QUOTE } = CUSTOMERS_PAGE;
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const customer = useSelector((state) => state.customersPage.customerData);
  const dispatch = useDispatch();

  const createQuoteHandler = async () => {
    const { _id, address, phone, name } = customer;
    const data = await createQuote({
      quote_info: {
        client_name: name,
        due_date: new Date(),
        started: false,
        address: address,
        status: DRAFT,
        customer_id: _id,
        quantity: 0,
        value: 0,
        client_phone: phone,
        // ??????????  //?????????
        order_category_id: '5f6e0ee658bf6041b4953c95',
        sub_category_id: '5e3a77fd5ee4ad2e1dff7bec',
        type: 0,
      },
      products: [],
    });

    const quoteId = data?.result;
    dispatch(setCustomerInfo({ address, phone, name }));
    history.push(`/${factoryName}/customers-page/create-quote/${_id}/${quoteId}`);
  };
  return <CreateButton clickHandler={createQuoteHandler}>{CREATE_QUOTE}</CreateButton>;
};

export default CreateQuoteButton;
