export const loginInfo = {
  userId: '',
  name: '',
  firstName: '',
  lastName: '',
  userType: 'user',
  company: 'Genesis',
  email: '',
  password: '',
  enteredPassword: '',
  deviceId: '',
  walletAmount: 0,
  message: '',
  notificationToken: '',
};

export const deviceInfo = {
  currentDeviceId: '',
  loginDeviceId: false,
};

export const initialState = {
  error: '',
  loading: false,
  login: loginInfo,
  deviceInfo: deviceInfo,
};
