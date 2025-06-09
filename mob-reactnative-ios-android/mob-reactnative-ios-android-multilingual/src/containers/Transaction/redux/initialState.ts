export const Transaction = {
  transactionId: '',
  userId: '',
  orderId: '',
  credit: '',
  debit: '',
  dateTime: '',
  adminUserId: '',
  itemId: '',
  quantity: '',
  status: '',
  amount: '',
  adminUserName: '',
  userName: '',
  nameHindi: '',
  walletAmount: '',
  itemName: '',
  itemNameHindi: '',
};

export const transactionInitialState = {
  loading: false,
  error: false,
  message: '',
  transactionHistoryList: [Transaction],
  totalDebit: '',
};
