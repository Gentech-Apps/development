import { foodMenuInitialState } from '../containers/FoodMenu/redux/initialState';
import { groceryInitialState } from '../containers/Grocery/redux/initialState';
import { loginInitialState } from '../containers/Login/redux/initialState';
import { orderInitialState } from '../containers/Order/redux/initialState';
import { networkInitialState } from '../containers/Reusables/NetworkStatus/redux/initialState';
import { transactionInitialState } from '../containers/Transaction/redux/initialState';
import { weeklyMenuInitialState } from '../containers/WeeklyMenu/redux/initialState';
import { navigationInitialState } from '../navigations/redux/initialState';

const TOKEN =
  'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIwIn0.TZE3UEe8wKsVqQuSHQNomPrAX711HMot1Xhq3HJ4l8Yy4DQou9LHI_GN-sD2IP6JbK8acn-ZVu_JXYXCTpfW7A';

export const User = {
  userId: 0,
  name: '',
  password: '',
  userType: '',
  company: '',
  deviceId: '',
  email: '',
  notificationToken: '',
  status: '',
  nameHindi: '',
  token: '',
  message: '',
  walletAmount: 0,
  credit: 0,
  debit: 0,
  oldPassword: '',
};

export const RootInitialState = {
  user: User,
  login: loginInitialState,
  navigation: navigationInitialState,
  menu: foodMenuInitialState,
  grocery: groceryInitialState,
  weeklyMenu: weeklyMenuInitialState,
  transaction: transactionInitialState,
  order: orderInitialState,
  network: networkInitialState,
};
