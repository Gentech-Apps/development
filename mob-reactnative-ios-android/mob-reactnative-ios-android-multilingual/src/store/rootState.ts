import { foodMenuState } from '../containers/FoodMenu/redux/interface';
import { groceryState } from '../containers/Grocery/redux/interface';
import { loginState } from '../containers/Login/redux/interface';
import { orderState } from '../containers/Order/redux/interface';
import { networkState } from '../containers/Reusables/NetworkStatus/redux/interface';
import { transactionState } from '../containers/Transaction/redux/interface';
import { weeklyMenuState } from '../containers/WeeklyMenu/redux/interface';
import { navigationState } from '../navigations/redux/interface';

export interface RootState {
  user?: UserState;
  login?: loginState;
  navbar?: navigationState;
  menu?: foodMenuState;
  grocery?: groceryState;
  weeklyMenu?: weeklyMenuState;
  transaction?: transactionState;
  order?: orderState;
  network?: networkState;
}

export interface UserState {
  userId: number | string;
  name: string;
  password: string;
  userType: string;
  company: string;
  deviceId: string;
  email: string;
  notificationToken: string;
  status: string;
  nameHindi: string;
  token: string;
  message: string;
  walletAmount: number | string;
  credit: number | string;
  debit: number | string;
  oldPassword: string;
  network?: networkState;
}
