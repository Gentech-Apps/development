export interface Transaction {
  transactionId: number | string;
  userId: number | string;
  orderId: number | string;
  credit: number | string;
  debit: number | string;
  dateTime: string;
  adminUserId: number | string;
  itemId: number | string;
  quantity: number | string;
  status: string;
  amount: number | string;
  adminUserName: string;
  userName: string;
  nameHindi: string;
  walletAmount: number | string;
  itemName: string;
  itemNameHindi: string;
}

export interface transactionState {
  loading?: boolean;
  error?: boolean;
  message?: string;
  transactionHistoryList?: Transaction[];
  totalDebit?: number | string;
}
