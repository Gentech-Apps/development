import { all } from 'redux-saga/effects';
import foodMenu from '../containers/FoodMenu/redux/saga';
import grocery from '../containers/Grocery/redux/saga';
import login from '../containers/Login/redux/saga';
import order from '../containers/Order/redux/saga';
import transaction from '../containers/Transaction/redux/saga';
import weeklyMenu from '../containers/WeeklyMenu/redux/saga';

export default function* rootSaga() {
  yield all([login(), foodMenu(), grocery(), weeklyMenu(), order(), transaction()]);
}
