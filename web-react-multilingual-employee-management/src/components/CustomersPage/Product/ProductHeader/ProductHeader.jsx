import React, { useState } from 'react';
import { useStyles, defaultColor } from './styles.js';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { PRODUCT_FORM } from '../../../../constants/translations/customersPage.js';
import { useHistory } from 'react-router-dom';

const ProductHeader = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { BACK_TO_QUOTE, SOME_TEXT, CHOOSE_PRODUCT_MODEL } = PRODUCT_FORM;
  const goBackToQuote = () => history.goBack();
  return (
    <div className={classes.headerHolder}>
      <div onClick={goBackToQuote} className={`${classes.backToQuoteLink} ${classes.headerText}`}>
        <ArrowForwardOutlinedIcon style={defaultColor} />
        <p className={classes.link}>{BACK_TO_QUOTE}</p>
      </div>
      <h3 className={classes.headerText}>{SOME_TEXT}</h3>
      <h3 className={classes.headerText}>{CHOOSE_PRODUCT_MODEL}</h3>
    </div>
  );
};

export default ProductHeader;
