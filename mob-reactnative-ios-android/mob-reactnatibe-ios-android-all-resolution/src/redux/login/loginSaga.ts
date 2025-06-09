import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { APP_API_URL } from '../../utils/constant';
import { request } from '../../utils/request';
import { showToastWithGravity } from '../../utils/toastAndriod';
import { loginInfo } from './loginInitialState';
import { loginData } from './loginRootState';
import { actions as loginActions } from './loginSlice';

function* userSingUp(
  actions: PayloadAction<{ data: loginData; callback: () => void }>,
): Generator<any, void, any> {
  const data = {
    name: actions.payload.data.name,
    password: actions.payload.data.password,
    userType: actions.payload.data.userType,
    company: actions.payload.data.company,
    email: actions.payload.data.email,
    userId: actions.payload.data?.userId,
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  try {
    const response: any = yield call(request, `${APP_API_URL}user/userRegistration`, options);
    console.log('response: ', response);

    if (!response) {
      yield put(loginActions.signUpFailed(response.message));
      showToastWithGravity(response.message);
      return;
    } else if (response.message === 'Registration successful') {
      yield put(loginActions.signUpSuccess(response));
      showToastWithGravity(response.message);
      showToastWithGravity('Please check your mail (' + response.email + ') for OTP');
      yield call(actions.payload?.callback);
    } else if (response.message === 'This app is only for snaxgenie organization') {
      yield put(loginActions.signUpFailed(response.message));
      showToastWithGravity(response.message);
    } else {
      yield put(loginActions.signUpFailed('Already Registered'));
      showToastWithGravity('Already Registered');
    }
  } catch (err: any) {
    yield put(loginActions.signUpFailed('Registration Failed'));
    showToastWithGravity('Registration Failed');
  }
}

function* userLogin(
  actions: PayloadAction<{ data: loginData; callback?: () => void }>,
): Generator<any, void, any> {
  const data = {
    name: actions.payload.data.name,
    password: actions.payload.data.enteredPassword
      ? actions.payload.data.enteredPassword
      : actions.payload.data?.password,
    userType: actions.payload.data.userType,
    company: actions.payload.data.company,
    deviceId: actions.payload.data.deviceId,
    notificationToken: actions.payload.data.notificationToken
      ? actions.payload.data.notificationToken
      : loginInfo.notificationToken,
  };
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  try {
    const response: any = yield call(request, `${APP_API_URL}user/userLogin`, options);
    if (!response) {
      yield put(loginActions.loginFailed('Login Failed'));
      showToastWithGravity('Login Failed');
    } else if (response.message === 'Login failed') {
      yield put(loginActions.loginFailed(response.message));
      showToastWithGravity('Login Failed');
    } else if (response.message === 'Invalid user name') {
      yield put(loginActions.loginFailed('Invalid login'));
    } else if (
      response.message === 'device Id already exist' ||
      response.message === '' ||
      response.message === null
    ) {
      yield put(loginActions.loginFailed('Device Id already exist'));
      showToastWithGravity('Device Id already exist');
    } else if (response.message === 'This account has been blocked by admin') {
      yield put(loginActions.loginFailed(response.message));
      showToastWithGravity(response.message);
    } else if (response.message === 'Invalid device id') {
      yield put(loginActions.loginFailed(response.message));
      yield put(loginActions.setUserId(response.userId));
    } else {
      const { deviceInfo } = yield select((state) => state.loginReducer);
      if (deviceInfo.loginDeviceId) {
        showToastWithGravity(response.message);
        yield put(loginActions.setLoginDeviceId(false));
      }
      yield put(loginActions.loginSuccess(response));
    }
  } catch (err: any) {
    console.log('Error', err);
    yield put(loginActions.loginFailed('Login Failed'));
    const networkStatus = yield select((state) => state.networkReducer.networkStatus);
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      showToastWithGravity('Login Failed');
      // } else {
      //   showToastWithGravity(PLEASE_CHECK_YOUR_CONNECTION);
    }
  }
}

export default function* loginSaga() {
  yield takeLatest(loginActions.SignUp.type, userSingUp);
  yield takeLatest(loginActions.updateUser.type, userSingUp);
  yield takeLatest(loginActions.login.type, userLogin);
}
