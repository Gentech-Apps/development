export const transactionData = {
  transactionId: 0,
  userId: 0,
  orderId: 0,
  credit: 0,
  debit: 0,
  dateTime: '',
  adminUserId: 0,
  itemId: 0,
  quantity: 0,
  status: '',
  amount: 0,
  adminUserName: '',
  userName: '',
  nameHindi: '',
  walletAmount: 0,
  itemName: '',
  itemNameHindi: '',
};

export const orderRequest = {
  userId: 0,
};

export const initialState = {
  loading: false,
  error: '',
  transactionData: [],
  orderRequest: orderRequest,
};
