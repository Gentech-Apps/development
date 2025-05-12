import React from 'react';
import AddProductHeaderLink from './HeaderLink';
import { useStyles } from '../styles';
import { QUOTE } from '../../../../constants/translations/customersPage';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ListSharpIcon from '@material-ui/icons/ListSharp';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const QuoteNavigation = ({ quoteId }) => {
  const { ALL_QUOTES, OPEN_QUOTE } = QUOTE;
  const classes = useStyles();
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const { customerId } = useParams();
  return (
    <div className={classes.navWrapper}>
      <AddProductHeaderLink
        icon={<ListSharpIcon />}
        label={ALL_QUOTES}
        path={`/${factoryName}/customers-page/${customerId}`}
      />
      {/* <AddProductHeaderLink
                icon = {<AddCircleOutlineIcon/>}
                label = {OPEN_QUOTE}
                path ={`/${factoryName}/customers-page/create-quote/${customerId}/${quoteId}`}
            /> */}
    </div>
  );
};

export default QuoteNavigation;
