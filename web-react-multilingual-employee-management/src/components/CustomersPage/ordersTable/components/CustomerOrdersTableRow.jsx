import React, { useCallback, useEffect, useRef, useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {
  CUSTOM_FIELDS_CONTACT_NAME,
  CUSTOM_FIELDS_PHONE,
} from '../../../../constants/custom-fields';
import moment from 'moment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Grid } from '@material-ui/core';
import { API } from '../../../../tools/keys/keys';
import { useSelector, useDispatch } from 'react-redux';
import { useStyles } from '../../styles/StylesForTables';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  CUSTOMER_REPORT,
  INTERNAL_REPORT,
  SIGNATURE,
  DOWNLOAD,
  UPDATE_ORDER,
  UPDATE_PROCESS,
  COPY_ORDER,
} from '../../../../constants/translations/customersPage';
import DialogPopup from '../../../reused-components/DialogPopup/dialogPopup';
import CreateButton from '../../reused_components/CreateButton';
import { linkToDataURL } from '../../../../utils/binaryConvertingData';
import { SERVICE } from '../../../../constants/factories';
import { appGetOrders } from '../../../../functions/api/orders';
import UpdateProccessPopup from '../../../updatePopups/UpdateProccessPopup';
import { getClientDateForPopup } from '../../../../functions/api/popup';
import {
  setOrderDataForPopup,
  setOrderIdForPopup,
  showMainPopup,
} from '../../../../actions/mainPopup_actions';
import { useParams } from 'react-router-dom';
import { getCustomerOrders, cloneOrder } from '../../../../functions/api/customer-page';
import { useCustomerReport } from '../../../../hooks/useCustomerPageReport';
import { CSVLink } from 'react-csv';

const CustomerOrdersTableRow = ({ data, setOrders }) => {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState('');

  const [showSignature, setShowSignature] = useState(false);

  const showSignatureHandler = () => {
    if (data.signature) setShowSignature((i) => !i);
  };

  const closeSignature = () => setShowSignature(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell size="medium" className={`${classes.tableBodyCellStyle}`}>
          {data.order_number}
        </TableCell>
        <TableCell size="medium" className={classes.tableBodyCellStyle}>
          {data.client_name}
        </TableCell>
        <TableCell size="medium" className={classes.tableBodyCellStyle}>
          {moment(data.due_date).format('DD-MM-YYYY')}
        </TableCell>
        <TableCell size="medium" className={classes.tableBodyCellStyle}>
          {data.custom_inputs ? data.custom_inputs[CUSTOM_FIELDS_CONTACT_NAME] : ''}
        </TableCell>
        <TableCell size="medium" className={classes.tableBodyCellStyle}>
          {data.custom_inputs ? data.custom_inputs[CUSTOM_FIELDS_PHONE] : ''}
        </TableCell>
        <TableCell size="medium" style={{ padding: 0 }} className={classes.tableBodyCellStyle}>
          <OrderDropDownMenu
            setOpen={setOpenMenu}
            open={openMenu}
            showSignatureHandler={showSignatureHandler}
            orderData={data}
            setOrders={setOrders}
          />
        </TableCell>
      </TableRow>
      {showSignature ? (
        <ShowSignatureDialog url={data.signature} isOpen={showSignature} onClose={closeSignature} />
      ) : null}
    </React.Fragment>
  );
};

const ShowSignatureDialog = ({ url, isOpen, onClose }) => {
  const getFileName = (url) => {
    return url?.split?.('/')?.slice?.(-1)?.[0];
  };

  const downloadHandler = async (url) => {
    const a = document.createElement('a');
    a.href = await linkToDataURL(url);
    a.download = getFileName(url);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <DialogPopup
      handleClose={onClose}
      width={'40%'}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={onClose}
      title={SIGNATURE}
      actions={
        <Grid>
          <CreateButton clickHandler={() => downloadHandler(`${API}${url}`)}>
            {DOWNLOAD}
          </CreateButton>
        </Grid>
      }
      content={<img src={`${API}${url}`} alt="signature" style={{ width: '100%' }} />}
    />
  );
};

const OrderDropDownMenu = (props) => {
  const { setOpen, open, showSignatureHandler, orderData, setOrders } = props;

  const { customerIdentifier: customerId } = useParams();
  const dispatch = useDispatch();
  const orderId = orderData._id;
  const [order_id, setOrderId] = useState('');
  const [reports, isLoading] = useCustomerReport(order_id);
  const off_days = useSelector((state) => state.login.user.off_days);
  const holidays = useSelector((state) => state.login.user.holidays);
  const factoryType = useSelector((state) => state.login.user.type_of_factory);
  const csvLink = useRef();
  const factoryName = useSelector((state) => state.login.user.factory_name);

  const openReportHandler = useCallback(
    () => window.open(`/${factoryName}/report-page/${orderId}`),
    [factoryName, orderId],
  );

  const [order, setOrder] = useState('');

  const openUpdateProcessHandler = useCallback(async (order) => {
    const { order_number, due_date, _id } = order;
    const responce = await appGetOrders(
      due_date,
      moment(due_date).add(7, 'day')._d,
      'L',
      order_number,
      null,
      null,
      null,
      null,
      true,
      100,
      0,
      -1,
      _id,
    );
    const orderData = responce?.[0] || '';
    if (orderData) {
      const { processes } = orderData;
      orderData.proccess = processes[0];
      setOrder(orderData);
    }
  }, []);

  const openEditOrderPopup = useCallback(async () => {
    let order_data_for_popup = await getClientDateForPopup(orderId);

    if (order_data_for_popup.ok) {
      dispatch(setOrderDataForPopup(order_data_for_popup.result));
      dispatch(setOrderIdForPopup(orderId));
      dispatch(showMainPopup(true));
    }
  }, [orderId]);

  const cloneOrderHandler = useCallback(async (order) => {
    const { _id: order_id } = order;
    const body = { customer_id: customerId, order_id };
    const orders = await cloneOrder(body);
    if (orders) setOrders(orders);
  }, []);

  const downloadExcel = () => {
    setTimeout(() => {
      if (reports.internalReport.length > 0) {
        csvLink.current.link.click();
      }
    }, 200);
  };

  const updatedOrder = useSelector((state) => state.mainPopup.edditedFromCustomersPage);

  useEffect(() => {
    const updateOrders = async () => {
      const { result } = await getCustomerOrders(customerId);
      if (result) setOrders(result);
    };
    if (updatedOrder) {
      updateOrders();
    }
  }, [updatedOrder, customerId]);

  const selectOptionHandler = (cb) => {
    // executes option click handler and close menu afteer that
    cb();
    setOpen('');
  };

  return (
    <React.Fragment>
      <IconButton
        onClick={(e) => {
          setOpen(e.currentTarget);
          console.log('order_id:: ', !order_id);
          !order_id && setOrderId(orderId);
        }}
      >
        <MoreVertIcon
          fontSize="large"
          style={{
            color: '#0091ff',
            cursor: 'pointer',
          }}
        />
      </IconButton>
      <Menu anchorEl={open} keepMounted open={!!open} onClose={() => setOpen('')}>
        {factoryType === SERVICE ? (
          <MenuItem onClick={() => selectOptionHandler(openReportHandler)}>
            {CUSTOMER_REPORT}
          </MenuItem>
        ) : null}
        {factoryType === SERVICE ? (
          <MenuItem onClick={() => selectOptionHandler(downloadExcel)}>{INTERNAL_REPORT}</MenuItem>
        ) : null}
        <CSVLink
          data={reports.internalReport}
          filename={reports.INTERNAL_REPORT_FILE_NAME}
          ref={csvLink}
        ></CSVLink>
        {factoryType === SERVICE ? (
          <MenuItem onClick={() => selectOptionHandler(() => openUpdateProcessHandler(orderData))}>
            {UPDATE_PROCESS}
          </MenuItem>
        ) : null}
        <MenuItem onClick={() => selectOptionHandler(openEditOrderPopup)}>{UPDATE_ORDER}</MenuItem>
        <MenuItem onClick={() => selectOptionHandler(showSignatureHandler)}>{SIGNATURE}</MenuItem>
        {factoryType !== SERVICE ? (
          <MenuItem onClick={() => selectOptionHandler(() => cloneOrderHandler(orderData))}>
            {COPY_ORDER}
          </MenuItem>
        ) : null}
      </Menu>
      {order ? (
        <UpdateProccessPopup
          // warningApiPayload = {this.state.updateApiBody}
          selectedProcess={order}
          view={'L'}
          closeUpdateMenu={() => setOrder('')}
          // on submit updates from pop up just close form after process is updated, because don't need to change view
          submitUpdatesFromPopup={() => setOrder('')}
          offDays={off_days}
          holidays={holidays}
          // saveNewSelectedProcess = {this.saveNewSelectedProcess}
          deleteBacklogsDuplications={() => ({})}
          openFrom={true}
        />
      ) : null}
    </React.Fragment>
  );
};

export default CustomerOrdersTableRow;
