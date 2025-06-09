import { all } from 'redux-saga/effects';
import loginSaga from '../redux/login/loginSaga';
import foodMenuSaga from '../redux/foodMenu/foodMenuSaga';
import weeklyMenuSaga from '../redux/weeklyMenu/weeklyMenuSaga';
import orderStatusSaga from '../redux/orderStatus/orderStatusSaga';
import transactionSaga from '../redux/transaction/transactionSaga';

export default function* rootSaga() {
  yield all([
    loginSaga(),
    foodMenuSaga(),
    weeklyMenuSaga(),
    orderStatusSaga(),
    transactionSaga(),
    //add more saga
  ]);
}
