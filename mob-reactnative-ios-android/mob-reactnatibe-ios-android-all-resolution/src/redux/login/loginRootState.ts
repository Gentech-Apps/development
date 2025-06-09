export interface RootState {
  loading: boolean;
  error?: string;
  loginData: loginData;
  deviceInfo: deviceInfo;
}

export interface loginData {
  userId?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  company?: string;
  email?: string;
  password?: string;
  enteredPassword?: string;
  deviceId?: string;
  notificationToken?: string;
  walletAmount?: string;
  message?: string;
}

export interface deviceInfo {
  currentDeviceId: number;
  loginDeviceId: boolean;
}
