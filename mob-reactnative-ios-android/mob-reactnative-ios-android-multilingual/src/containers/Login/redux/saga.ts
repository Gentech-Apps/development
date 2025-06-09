// Starts login on each dispatched action
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as config from '../../../../app.json';
import { RootInitialState } from '../../../store/rootInitialState';
import { request } from '../../../utils/apis/request';
import { loginInitialState } from './initialState';
import { loginState } from './interface';
import { failed, success, updateUserData, validateUser } from './slice';

function* validateLogin(
  actions: PayloadAction<{ login: loginState; _callback?: () => void }>,
): Generator<any, void, any> {
  try {
    const payload: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        email: actions.payload.login.email,
        password: actions.payload.login.password,
        userType: loginInitialState.userType,
        notificationToken: actions.payload.login.notificationToken,
      }),
    };
    const result = yield call(request, config.API_URL + '/user/vendorLogin', payload);
    if (result.message === 'Login successful') {
      yield put(success(result));
      if (actions.payload?.hasOwnProperty('_callback')) {
        yield call(actions.payload?._callback);
      }
    } else {
      yield put(failed(result));
    }
  } catch (err: any) {
    console.warn('Error32: ', err);
    yield put(failed({ message: err }));
  }
}

// Allows concurrent fetches of user
function* login() {
  yield takeLatest(validateUser.type, validateLogin);
  yield takeLatest(updateUserData.type, validateLogin);
}

export default login;
