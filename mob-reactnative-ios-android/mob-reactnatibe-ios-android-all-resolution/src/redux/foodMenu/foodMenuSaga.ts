import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  APP_API_URL,
  INSUFFICIENT_BALANCE,
  ORDER_UNSUCCESSFULL,
  ORDER_UNSUCCESSFULL_PLEASE_TRY_AGAIN,
} from '../../utils/constant';
import { evaluateOrderAcceptDateTimeAsIndianTimezone, updateFoodList } from '../../utils/helper';
import { request } from '../../utils/request';
import { showToastWithGravity } from '../../utils/toastAndriod';
import { saveFeedbackData, saveOrderData } from './foodMenuRootState';
import { actions } from './foodMenuSlice';

function* getAllMenusViaCategoryCall(): Generator<any, void, any> {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const response: any = yield call(request, `${APP_API_URL}menu/getMenuOfTheDay`, options);
    const result: any = yield call(updateFoodList, response.menuOfTheDay);
    if (!response) {
      yield put(actions.getAllMenusViaCategoryFailed('Failed'));
      return;
    }
    yield put(actions.getAllMenusViaCategorySuccess(result));
  } catch (err: any) {
    yield put(actions.getAllMenusViaCategoryFailed(err));
  }
}

function* saveOrderCall(
  action: PayloadAction<{ data: saveOrderData; callback: () => void }>,
): Generator<any, void, any> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action.payload.data),
  };
  try {
    const response: any = yield call(request, `${APP_API_URL}order/saveOrder`, options);
    if (response.message == ORDER_UNSUCCESSFULL) {
      yield put(actions.saveOrderFailed(response.message));
      showToastWithGravity(INSUFFICIENT_BALANCE);
      return;
    } else if (!response) {
      yield put(actions.saveOrderFailed(response.message));
      showToastWithGravity(ORDER_UNSUCCESSFULL_PLEASE_TRY_AGAIN);
      return;
    }
    yield put(actions.saveOrderSuccess(response.menuOfTheDay));
    yield call(action.payload.callback);
  } catch (err: any) {
    yield put(actions.saveOrderFailed(err));
    showToastWithGravity('Order Failed');
  }
}

function* saveFeedback(
  action: PayloadAction<{ data: saveFeedbackData; callback: () => void }>,
): Generator<any, void, any> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action.payload.data),
  };

  try {
    const response: any = yield call(request, `${APP_API_URL}feedback/saveFeedback`, options);
    if (response.message === 'Thankyou for Rating') {
      yield put(actions.saveFeedbackSuccess());
      showToastWithGravity(response.message);
      yield call(action.payload.callback);
    } else {
      showToastWithGravity(response.message);
    }
  } catch (err: any) {
    yield put(actions.saveFeedbackFailed(err));
    showToastWithGravity('Feedback Failed');
  }
}

function* fetchServerDateTime(): Generator<any, void, any> {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const response: any = yield call(
      request,
      `https://pegasus.genesisapps.in/api/timesheets/getServerDate`,
      options,
    );

    if (!response) {
      yield put(actions.setErrorServerDateTime('Something went wrong.'));
      return;
    }
    yield put(actions.setServerDateTime(evaluateOrderAcceptDateTimeAsIndianTimezone(response)));
  } catch (err: any) {
    yield put(actions.setErrorServerDateTime(err));
  }
}

export default function* foodMenuSaga() {
  yield takeLatest(actions.getAllMenusViaCategory.type, getAllMenusViaCategoryCall);
  yield takeLatest(actions.saveOrder.type, saveOrderCall);
  yield takeLatest(actions.saveFeedback.type, saveFeedback);
  yield takeLatest(actions.getServerDateTime, fetchServerDateTime);
}
