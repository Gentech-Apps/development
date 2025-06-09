import { call, put, takeLatest } from 'redux-saga/effects';
import * as config from '../../../../app.json';
import { request } from '../../../utils/apis/request';
import { failed, fetchTransactionHistory, success } from './slice';

function* fetchAllTransactionHistory(): Generator<any, void, any> {
  try {
    const payload: RequestInit = {
      method: 'GET',
    };
    const result = yield call(
      request,
      config.API_URL + '/transaction/getAllTransactionsForVendor',
      payload,
    );
    yield put(success(result));
  } catch (err: any) {
    yield put(failed({ message: err }));
  }
}

// Allows concurrent fetches of user
function* transaction() {
  yield takeLatest(fetchTransactionHistory.type, fetchAllTransactionHistory);
}

export default transaction;
