import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setState } from '../../utils/asyncStorage';
import { initialState, loginInfo } from './loginInitialState';

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, actions: PayloadAction<{ data: any; callback?: () => void }>) => {
      state.loading = true;
      state.error = '';
    },
    loginSuccess: (state, actions: PayloadAction<any>) => {
      state.login = actions.payload;
      state.loading = false;
      state.error = '';
      setState('auth', JSON.stringify(actions.payload));
    },
    loginFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.login.message = actions.payload;
      state.loading = false;
    },
    SignUp: (state, actions: PayloadAction<{ data: any; callback: () => void }>) => {
      state.loading = true;
      state.error = '';
    },
    updateUser: (state, actions: PayloadAction<{ data: any; callback?: () => void }>) => {
      state.loading = true;
      state.error = '';
    },
    signUpSuccess: (state, actions: PayloadAction<any>) => {
      state.login = actions.payload;
      state.loading = false;
      state.error = '';
    },
    signUpFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.login.message = actions.payload;
      state.loading = false;
    },
    updateWalletAmount: (state, actions: PayloadAction<any>) => {
      state.login.walletAmount = actions.payload;
    },
    resetSaveUserData: (state) => {
      state.login = loginInfo;
    },
    setSaveUserData: (
      state,
      action: PayloadAction<{ name: string; value: any; form?: string }>,
    ) => {
      const form = action.payload.form ? action.payload.form : 'form';
      const { name, value } = action.payload;
      if (name === 'firstName') {
        state.login.firstName = value;
      } else if (name === 'lastName') {
        state.login.lastName = value;
      } else if (name === 'password') {
        state.login.password = value;
      } else if (name === 'name') {
        state.login.name = value;
      } else if (name === 'enteredPassword') {
        state.login.enteredPassword = value;
      } else if (name === 'deviceId') {
        state.login.deviceId = value;
      } else if (name === 'email') {
        state.login.email = value;
      } else if (name === 'company') {
        state.login.company = value;
      } else if (name === 'userId') {
        state.login.userId = value;
      } else if (name === 'message') {
        state.login.message = value;
      } else {
        state.login.notificationToken = value;
      }
    },
    setDeviceInfo: (state, actions: PayloadAction<any>) => {
      state.deviceInfo.currentDeviceId = actions.payload;
    },
    setLoginDeviceId: (state, actions: PayloadAction<any>) => {
      state.deviceInfo.loginDeviceId = actions.payload;
    },
    setUserId: (state, actions: PayloadAction<any>) => {
      state.login.userId = actions.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = loginSlice;
