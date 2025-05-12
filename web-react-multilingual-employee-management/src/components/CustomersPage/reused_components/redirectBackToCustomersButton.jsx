import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useStyles } from './style';
import { BACK } from '../../../constants/translations/customersPage';

const RedirectBackToCustomersButton = (props) => {
  const history = useHistory();
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const classes = useStyles();
  // const { customerIdentifier: customerId } = useParams()
  const goBackToCustomersPageHandler = () => {
    history.push(`/${factoryName}/customers-table`);
  };

  return (
    <Button
      variant="contained"
      onClick={goBackToCustomersPageHandler}
      className={classes.goBackButton}
    >
      {BACK}
    </Button>
  );
};

export default RedirectBackToCustomersButton;
