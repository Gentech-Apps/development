import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootInitialState, User } from '../../../store/rootInitialState';
import { UserState } from '../../../store/rootState';
import { removeFromStore, saveInStore } from '../../../utils/helpers/utils';
import { loginState } from './interface';
import { loginInitialState } from './initialState';

export const loginSlice = createSlice({
  name: 'login',
  initialState: RootInitialState,
  reducers: {
    setEmail: (state: any, actions: PayloadAction<string>) => {
      state.login.email = actions.payload;
      state.login.error = false;
      state.login.message = '';
    },
    setPassword: (state: any, actions: PayloadAction<string>) => {
      state.login.password = actions.payload;
      state.login.error = false;
      state.login.message = '';
    },
    setNotification: (state: any, actions: PayloadAction<string>) => {
      state.login.notificationToken = actions.payload;
    },
    validateUser: (
      state: any,
      actions: PayloadAction<{ login: loginState; _callback: () => void }>,
    ) => {
      state.login.loading = true;
    },
    success: (state: any, actions: PayloadAction<any>) => {
      state.login.loading = false;
      state.user = actions.payload;
      saveInStore('user', JSON.stringify(actions.payload));
    },
    failed: (state: any, actions: PayloadAction<any>) => {
      state.login.loading = false;
      state.login.error = true;
      state.login.message = actions.payload.message;
    },
    updateUserData: (state: any, actions: PayloadAction<{ login: UserState }>) => {
      state.user = actions.payload.login;
    },
    logout: (state: any) => {
      state.user = User;
      removeFromStore();
    },
    resetLoginError(state: any) {
      state.login.error = false;
      state.login.message = '';
    },
    resetLogin: (state: any) => {
      state.login = loginInitialState;
    },
  },
});

export const {
  setEmail,
  setPassword,
  validateUser,
  success,
  failed,
  updateUserData,
  logout,
  resetLoginError,
  resetLogin,
  setNotification,
} = loginSlice.actions;
export default loginSlice.reducer;
