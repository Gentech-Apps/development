import React from 'react';
import { useStyles } from '../styles';
import { QUOTE } from '../../../../constants/translations/customersPage';
import Button from '@material-ui/core/Button';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPrintActive } from '../../../../actions/quotation-actions';

const QuoteButtons = ({ submitForm, NOT_VALID_FIELDS }) => {
  const { SAVE, PRINT } = QUOTE;
  const classes = useStyles();
  const history = useHistory();
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const { customerId, quoteId } = useParams();
  const dispatch = useDispatch();

  const createAndUploadPdfHandler = async () => {
    const submitResult = await submitForm();
    if (submitResult === NOT_VALID_FIELDS) return;
    dispatch(setPrintActive(true));
  };

  const saveHandler = async () => {
    const submitResult = await submitForm();
    if (submitResult === NOT_VALID_FIELDS) return;
    redirectToCustomerPage();
  };

  const redirectToCustomerPage = () => {
    history.push(`/${factoryName}/customers-page/${customerId}`);
  };

  return (
    <React.Fragment>
      <div className={`${classes.navWrapper} ${classes.buttonsWrapper}`}>
        <Button
          variant="contained"
          className={`${classes.button} ${classes.okButton}`}
          onClick={saveHandler}
        >
          {SAVE}
        </Button>
        <Button
          variant="outlined"
          className={`${classes.button} ${classes.printButton}`}
          onClick={createAndUploadPdfHandler}
        >
          {PRINT}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default QuoteButtons;
