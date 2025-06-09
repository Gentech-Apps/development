export interface loginState {
  loading?: boolean;
  email: string;
  password: string;
  message?: string;
  error?: boolean;
  userType?: string;
  notificationToken?: string;
}
