import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { Tabs, Tab, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useStyles } from '../styles/CustomersTable.styles';
import {
  CALENDAR,
  EMAIL,
  CALLS,
  FILES,
  SYSTEM,
  ORDERS,
  QUOTES,
} from '../../../constants/translations/customersPage';
import CustomerOrders from '../ordersTable/orders';
import Files from '../Files/files';
import ButtonsWrapper from '../reused_components/buttonsWrapper';
import AddFilesButton from '../Buttons/AddFilesButton';
import Systems from '../Systems/systems';
import AddSystemButton from '../Buttons/AddSystemButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateDataCheckList, updateCustomerFirstLevelSystems } from '../../../actions/actions';
import { SERVICE } from '../../../constants/factories';
import QuotationTable from '../QuotationTable/QuotationTable';
import CreateQuoteButton from '../Buttons/CreateQuoteButton';
import { withStyles } from '@material-ui/core';
import { BLUE_COLOR, CUSTOMERS_PAGE_FONT_SIZE } from '../../../constants/customers-page';
import { getOrderSystemsList } from '../../../functions/api/orders';
import { useMemo } from 'react';

const CustomerTabs = (props) => {
  const system_close_ref = useRef({});
  const [loader, setLoader] = useState(true);
  const factoryType = useSelector((state) => state?.login?.user?.type_of_factory);
  const { orders, customer, setOrders, system_view } = props;
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(system_view || 6);
  const dispatch = useDispatch();
  const orders_list = useSelector((state) => state.customersPage.setCustomerOrders);

  useEffect(() => {
    const orderId = orders_list[0]?._id;
    if (orderId !== undefined) {
      getOrderSystemsList(orderId).then((data) => dispatch(updateDataCheckList(data?.result)));
    }
  }, [orders_list[0]?._id]);

  const FIRST_LAYER = 1;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const setSystemCloseRef = (data) => {
    system_close_ref.current = { ...system_close_ref.current, [data._id]: data.value };
  };

  const { _id: customerId, attachments: files, systems } = customer;

  return (
    <>
      <Grid className={classes.tabsWrapper}>
        <StyledTabs
          value={activeTab}
          onChange={handleChange}
          variant="fullWidth"
          style={{
            boxShadow: 'none',
          }}
        >
          <StyledTab
            value={1}
            className={classes.leftTab}
            component={'div'}
            disabled={true}
            label={CALENDAR}
          />
          <StyledTab value={2} className={classes.tab} disabled={true} label={EMAIL} />
          <StyledTab value={3} className={classes.tab} disabled={true} label={CALLS} />
          <StyledTab value={4} className={classes.tab} component={'div'} label={FILES} />
          <StyledTab
            value={5}
            className={classes.tab}
            label={factoryType === SERVICE ? SYSTEM : QUOTES}
          />
          <StyledTab value={6} className={classes.rightTab} label={ORDERS} />
        </StyledTabs>
        <StyledTabPanel value={activeTab} index={1} name={CALENDAR}>
          {<div>{CALENDAR}</div>}
        </StyledTabPanel>
        <StyledTabPanel value={activeTab} index={2} name={EMAIL}>
          {<div>{EMAIL}</div>}
        </StyledTabPanel>
        <StyledTabPanel value={activeTab} index={3} name={CALLS}>
          {<div>{CALLS}</div>}
        </StyledTabPanel>
        <StyledTabPanel value={activeTab} index={4} name={FILES}>
          <ButtonsWrapper>
            <AddFilesButton customerId={customerId} />
          </ButtonsWrapper>
          <Files customerId={customerId} files={files} />
        </StyledTabPanel>
        <StyledTabPanel value={activeTab} index={5} name={SYSTEM}>
          <ButtonsWrapper>
            {factoryType === SERVICE ? (
              <AddSystemButton customerId={customerId} />
            ) : (
              <CreateQuoteButton />
            )}
          </ButtonsWrapper>
          {factoryType === SERVICE ? (
            <Systems
              systems={systems}
              updateSiblings={(systems) => dispatch(updateCustomerFirstLevelSystems(systems))}
              parentSystemId={null}
              currentLayer={FIRST_LAYER}
              customer={customer}
              setSystemCloseRef={setSystemCloseRef}
              system_close_ref={system_close_ref}
            />
          ) : (
            <QuotationTable customerId={customerId} />
          )}
        </StyledTabPanel>
        <StyledTabPanel value={activeTab} index={6} name={ORDERS}>
          <CustomerOrders orders={orders} setOrders={setOrders} customer={customer} />
        </StyledTabPanel>
      </Grid>
    </>
  );
};

const StyledTabPanel = (props) => {
  const { value, index, name, children } = props;
  return (
    <TabPanel value={value} index={index}>
      {children}
    </TabPanel>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 100,
      width: '100%',
      backgroundColor: BLUE_COLOR,
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    // fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing(4),
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
    fontSize: CUSTOMERS_PAGE_FONT_SIZE,
    fontWeight: '600',
    color: '#455768',
    border: `1px solid rgba(224, 224, 224, 1)`,
    '&:hover': {
      // color: BLUE_COLOR,
      border: `1px solid ${BLUE_COLOR}`,
      opacity: 1,
      background: 'rgba(0, 145, 255, 0.2)',
    },
    '&$selected': {
      // color: BLUE_COLOR,
      border: `1px solid ${BLUE_COLOR}`,
      background: 'rgba(0, 145, 255, 0.2)',
    },
    '&:focus': {
      // color: BLUE_COLOR,
      border: `1px solid ${BLUE_COLOR}`,
      background: 'rgba(0, 145, 255, 0.2)',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default CustomerTabs;
