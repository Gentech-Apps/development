import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as config from '../../../../app.json';
import { request } from '../../../utils/apis/request';
import {
  ORDER_ACCEPTED_HI,
  ORDER_CANCELLED_HI,
  SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_HI,
} from '../../../utils/constants';
import { Toaster } from '../../../utils/helpers/utils';
import { updateOrderRequest } from './interface';
import { failed, fetchAllOrders, success, updateOrder } from './slice';

function* fetchOrders(): Generator<any, void, any> {
  try {
    const payload: RequestInit = {
      method: 'GET',
    };
    let result = yield call(request, config.API_URL + '/order/getAllOrderForVendor', payload);
    result = {
      ...result,
      ordersForVendorList: result?.ordersForVendorList?.reverse(),
    };
    yield put(success(result));
  } catch (err: any) {
    yield put(failed({ message: err }));
  }
}

function* updateOrders(
  actions: PayloadAction<{ orderDetails: updateOrderRequest; _callback: () => void }>,
): Generator<any, void, any> {
  try {
    const payload: RequestInit = {
      method: 'POST',
      body: JSON.stringify(actions.payload.orderDetails),
    };
    const result = yield call(request, config.API_URL + '/order/saveOrder', payload);
    if (result?.id) {
      yield call(actions.payload._callback);
      if (result?.status === 'delivered') {
        Toaster(ORDER_ACCEPTED_HI);
      } else {
        Toaster(ORDER_CANCELLED_HI);
      }
    } else {
      Toaster(SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_HI);
    }
  } catch (err: any) {
    yield put(failed({ message: err }));
  }
}

// Allows concurrent fetches of user
function* order() {
  yield takeLatest(fetchAllOrders.type, fetchOrders);
  yield takeLatest(updateOrder.type, updateOrders);
}

export default order;
