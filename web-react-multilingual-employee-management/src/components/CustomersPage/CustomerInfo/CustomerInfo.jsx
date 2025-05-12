import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  CREATE_CUSTOMER_POPUP,
  CUSTOMER_INFO_TABLE,
} from '../../../constants/translations/customersPage';
import moment from 'moment';
import { useStyles } from './style';

const CustomerInfo = ({ customer }) => {
  const classes = useStyles();
  const {
    BUILDING_MODEL,
    TERMS_OF_ENGAGEMENT,
    PROJECT_DESCRIPTION,
    FLOORS_QUANTITY,
    PARKING_LEVELS_QUANTITY,
    IS_THE_PARKING_LOT_SHARED,
    SHARED_PARKINGS_FOR_A_NUMBER_OF_BUILDINGS,
    YEAR_OF_OCCUPANCY,
  } = CREATE_CUSTOMER_POPUP;

  const {
    CUSTOMER_NUMBER,
    CUSTOMER_NAME,
    CONTACT_NAME,
    PHONE,
    EMAIL,
    CITY,
    ADDRESS,
    DETAILS,
  } = CUSTOMER_INFO_TABLE;

  const {
    customer_number,
    name,
    contact_name,
    phone,
    email,
    city,
    address,
    terms_of_engagement,
    building_model,
    floors_quantity,
    parking_levels_quantity,
    parking_lot_shared,
    shared_parkings,
    year_of_occupancy,
    description,
  } = customer;

  return (
    <TableContainer component={Paper} className={classes.infoTablePaper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              className={`${classes.genericTableCell} ${classes.headerCell} ${classes.boldCell}`}
            >
              {DETAILS}
            </TableCell>
            <TableCell
              className={`${classes.genericTableCell} ${classes.headerCell} ${classes.boldCell}`}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <CustomerInfoTableRow title={CUSTOMER_NUMBER} info={customer_number} />
          <CustomerInfoTableRow title={CUSTOMER_NAME} info={name} />
          <CustomerInfoTableRow title={CONTACT_NAME} info={contact_name} />
          <CustomerInfoTableRow title={PHONE} info={phone} />
          <CustomerInfoTableRow title={EMAIL} info={email} />
          <CustomerInfoTableRow title={CITY} info={city} />
          <CustomerInfoTableRow title={ADDRESS} info={address} />
          <CustomerInfoTableRow title={TERMS_OF_ENGAGEMENT} info={terms_of_engagement} />
          <CustomerInfoTableRow title={BUILDING_MODEL} info={building_model} />
          <CustomerInfoTableRow title={PROJECT_DESCRIPTION} info={description} />
          <CustomerInfoTableRow title={FLOORS_QUANTITY} info={floors_quantity} />
          <CustomerInfoTableRow title={PARKING_LEVELS_QUANTITY} info={parking_levels_quantity} />
          <CustomerInfoTableRow title={IS_THE_PARKING_LOT_SHARED} info={parking_lot_shared} />
          <CustomerInfoTableRow
            title={SHARED_PARKINGS_FOR_A_NUMBER_OF_BUILDINGS}
            info={shared_parkings}
          />
          <CustomerInfoTableRow
            title={YEAR_OF_OCCUPANCY}
            info={year_of_occupancy ? moment(year_of_occupancy).format('DD/MM/YYYY') : null}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CustomerInfoTableRow = (props) => {
  const { title, info } = props;
  const classes = useStyles();

  return info ? (
    <TableRow>
      {title ? (
        <TableCell className={`${classes.genericTableCell} ${classes.boldCell}`}>{title}</TableCell>
      ) : null}
      <TableCell className={`${classes.genericTableCell} ${classes.plainCell}`}>{info}</TableCell>
    </TableRow>
  ) : null;
};

export default CustomerInfo;
