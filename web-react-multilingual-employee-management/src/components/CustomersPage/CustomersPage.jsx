import React, { useState, useEffect, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import CustomerInfo from './CustomerInfo/CustomerInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerInfoById, setCustomerPageOrders } from '../../actions/customers_table_actions';
import { useStyles } from './styles/CustomersTable.styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { StylesProvider, ThemeProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { getCustomerOrders } from '../../functions/api/customer-page';
import { METALPRESS } from '../../constants/factories';
import { clearQuoteData } from '../../actions/quotation-actions';
// import { updateCustomerFirstLevelSystems } from '../../actions/customers_table_actions';
// import CustomersPageService from './Service/CustomersPage'
import LoaderNew from '../LoaderNew/Loader';
import FiltersAndAdditionalActionsWrapper from '../reused-components/filtersAndAdditionalActionsWrapper';
import Stripe from '../reused-components/Stripe';
import Tabs from './Tabs/Tabs';
import RedirectBackToCustomersButton from './reused_components/redirectBackToCustomersButton';
import EditCustomerSection from './EditCustomerSection/editCustomerSection';
import { generalGetRequest } from '../../functions/api/general';
import {
  updateCustomerFirstLevelSystems,
  setCallbackAndCredentialsForAddingSystem,
} from '../../actions/actions';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createMuiTheme({
  direction: 'rtl',
});

const useCustomerOrders = (customerId, lastCreatedOrderId) => {
  const [ordersList, setOrdersList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchOrders() {
      const { result } = await getCustomerOrders(customerId);
      if (result) {
        setOrdersList(result);
        dispatch(setCustomerPageOrders(result));
      }
    }
    fetchOrders();
  }, [customerId, lastCreatedOrderId]);

  return [ordersList, setOrdersList];
};

const CustomersPage = (props) => {
  const classes = useStyles();
  const [loader, setLoader] = useState(true);
  const customerId = props.match.params.customerIdentifier;
  const customerData = useSelector((state) => state.customersPage.customerData);
  const set_system_view = useSelector((state) => state.customersPage.set_system_view);
  const dispatch = useDispatch();
  const lastCreatedOrderId = useSelector(
    (state) => state.customersPage.createOrderFromCustomerPageResult,
  );
  const [orders, setOrders] = useCustomerOrders(customerId, lastCreatedOrderId);
  const factoryId = useSelector((state) => state.login.user.factory_id);

  const isMetalpress = factoryId === METALPRESS;

  useEffect(() => {
    // set credentials for adding systems
    const handleDataForAddingSystem = () => {
      const FIRST_LAYER = 1;
      const data = {
        updateSystems: (systems) => dispatch(updateCustomerFirstLevelSystems(systems)),
        parentSystemId: null /*first layer doesn't have parent system */,
        layer: FIRST_LAYER,
      };
      dispatch(setCallbackAndCredentialsForAddingSystem(data));
    };

    handleDataForAddingSystem();
    dispatch(getCustomerInfoById(customerId));
    dispatch(clearQuoteData());
  }, [props.match.params.customerIdentifier]);

  useEffect(() => {
    let time_out = setTimeout(() => setLoader(false), 0);
    return () => clearTimeout(time_out);
  }, []);

  return (
    <>
      {loader && <LoaderNew />}
      {customerData && (
        <StylesProvider jss={jss}>
          <ThemeProvider theme={theme}>
            <FiltersAndAdditionalActionsWrapper>
              <RedirectBackToCustomersButton />
            </FiltersAndAdditionalActionsWrapper>
            <Stripe />
            <Grid className={`${classes.customersPageWrapper} ${classes.customer_page_over}`}>
              <EditCustomerSection />
              <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
                <CustomerInfo customer={customerData} />
                <Tabs
                  orders={orders}
                  setOrders={setOrders}
                  customer={customerData}
                  system_view={set_system_view}
                />
              </Grid>
            </Grid>
          </ThemeProvider>
        </StylesProvider>
      )}
    </>
  );
};

export default CustomersPage;
