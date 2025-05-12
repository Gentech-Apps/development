import React, { useEffect, useState, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import CustomersTableRow from './parts/customersTableRow';
import CustomersTableHead from './parts/customersTableHead';
import { StyledPaper } from '../styles/CustomersTable.styles';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomersData } from '../../../actions/customers_table_actions';
import addIcon from '../../../images/reviewPopup/add.svg';
import TableContainer from '@material-ui/core/TableContainer';
import Grid from '@material-ui/core/Grid';
import CreateCustomerPopUp from '../Popups/createCustomerPopUp';
import { useStyles, jss, theme } from '../styles/CustomersTable.styles';
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import { useCustomersFilter } from '../../../hooks/useCustomersFilter';
import { setOptionsForAutocomplete } from '../../../actions/customers_table_actions';
// import { useCustomerInputs } from '../../../hooks/useCustomerInputs'
import Stripe from '../../reused-components/Stripe';
import { Typography } from '@material-ui/core';
import { TOTAL_CUSTOMERS } from '../../../constants/translations/customersPage';
import { setRouteLocation } from '../../../actions/route_action';
import Loader from '../../LoaderNew/Loader';

const useAutocompleteValues = (customersData) => {
  const dispatch = useDispatch();
  const queryForAutocomplete = useSelector((state) => state.customersPage.queryForAutocomplete);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const createAutocomletionOptions = (data, queryForAutocomplete) => {
      let result = [];
      if (data && queryForAutocomplete) {
        data.map((customer) => {
          const { address, city, contact_name, customer_number, email, name, phone } = customer;

          let values = Object.values({
            address,
            city,
            contact_name,
            customer_number,
            email,
            name,
            phone,
          });

          result = [...result, ...values];
        });
      }

      result = [...new Set(result)];
      const optionsFilter = (query) => (option) =>
        option?.toUpperCase?.()?.startsWith(query?.toUpperCase());
      const filteredOptions = result
        .filter(optionsFilter(queryForAutocomplete))
        .map((i, idx) => ({ _id: idx, order_number: i }));
      dispatch(setOptionsForAutocomplete(filteredOptions));
    };
    createAutocomletionOptions(customersData, queryForAutocomplete);
  }, [customersData, queryForAutocomplete]);

  useEffect(() => {
    setOptionsForAutocomplete(options);
  }, [options]);
};

const CustomersTable = ({ history }) => {
  const [loader, setLoader] = useState(true);
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const customersData = useSelector((state) => state.customersPage.customersList);
  const customersFilter = useSelector((state) => state.customersPage.customersFilter);
  const customers = useCustomersFilter(customersData, customersFilter);
  const dispatch = useDispatch();
  const classes = useStyles();
  // const options = useCustomerInputs()

  useAutocompleteValues(customersData);
  useEffect(() => {
    dispatch(getCustomersData());
    let pathname = window.location.pathname;
    dispatch(setRouteLocation(pathname));
  }, []);

  useEffect(() => {
    let time_out = setTimeout(() => setLoader(false), 0);
    return () => clearTimeout(time_out);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <StylesProvider jss={jss}>
          <ThemeProvider theme={theme}>
            <StyledPaper>
              <Stripe>
                <Typography className={classes.totalCustomers}>
                  {`${TOTAL_CUSTOMERS} ${customers?.length || 0}`}
                </Typography>
              </Stripe>
              <Grid container direction={'column'}>
                <Grid item>
                  <TableContainer className={classes.container}>
                    <Table size="small" stickyHeader>
                      <CustomersTableHead />
                      <TableBody>
                        {customers?.map?.((customer) => (
                          <CustomersTableRow
                            key={customer._id}
                            history={history}
                            customer={customer}
                            factoryName={factoryName}
                            // options={options}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item>
                  {isOpen ? (
                    <CreateCustomerPopUp
                      isOpen={isOpen}
                      handleClose={handleClose}
                      // options={options}
                    />
                  ) : null}
                  <img
                    src={addIcon}
                    alt="add customer"
                    className={classes.buttonStyle}
                    onClick={handleClickOpen}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </ThemeProvider>
        </StylesProvider>
      )}
    </>
  );
};

export default CustomersTable;
