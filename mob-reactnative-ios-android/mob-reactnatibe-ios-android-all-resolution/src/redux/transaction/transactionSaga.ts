import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { APP_API_URL } from '../../utils/constant';
import { request } from '../../utils/request';
import { actions as userActions } from '../login/loginSlice';
import { orderRequest } from './transactionRootState';
import { actions } from './transactionSlice';

function* getAllOrderHistory(action: PayloadAction<orderRequest>): Generator<any, void, any> {
  const userId = action.payload.userId;
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const response: any = yield call(
      request,
      `${APP_API_URL}transaction/getAllTransactionsByuserId?userId=` + userId,
      options,
    );

    if (!response) {
      yield put(actions.getAllOrdersHistoryFailed('Failed'));
      return;
    }
    yield put(actions.getAllOrdersHistorySuccess(response.allTransactionHistory));
    yield put(userActions.updateWalletAmount(response.totalwallet));
  } catch (err: any) {
    yield put(actions.getAllOrdersHistoryFailed(err));
  }
}

export default function* transactionSaga() {
  yield takeLatest(actions.getAllOrdersHistory.type, getAllOrderHistory);
}
