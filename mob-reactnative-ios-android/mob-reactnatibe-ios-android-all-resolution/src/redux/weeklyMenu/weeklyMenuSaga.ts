import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { APP_API_URL } from '../../utils/constant';
import { request } from '../../utils/request';
import { showToastWithGravity } from '../../utils/toastAndriod';
import { suggestionRequest } from './weeklyMenuRootState';
import { actions } from './weeklyMenuSlice';

function* getAllWeeklyMenuCall(): Generator<any, void, any> {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const response: any = yield call(request, `${APP_API_URL}menu/getAllWeeklyMenu`, options);
    if (!response) {
      yield put(actions.getAllWeeklyMenuFailed('Failed'));
      return;
    }
    yield put(actions.getAllWeeklyMenuSuccess(response.weeklyMenu));
  } catch (err: any) {
    yield put(actions.getAllWeeklyMenuFailed(err));
  }
}

function* addSuggestion(
  action: PayloadAction<{ data: suggestionRequest; callback: () => void }>,
): Generator<any, void, any> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action.payload.data),
  };

  try {
    const response: any = yield call(request, `${APP_API_URL}menu/addMenuSuggestion`, options);
    if (response.message === 'Added Successfully') {
      yield put(actions.addSuggestionSuccess(response.message));
      showToastWithGravity(response.message);
      yield call(action.payload.callback);
    } else {
      showToastWithGravity(response.message);
    }
  } catch (err: any) {
    yield put(actions.addSuggestionFailed(err));
    showToastWithGravity('Suggestion Failed');
  }
}

export default function* weeklyMenuSaga() {
  yield takeLatest(actions.getAllWeeklyMenu.type, getAllWeeklyMenuCall);
  yield takeLatest(actions.addSuggestion.type, addSuggestion);
}
