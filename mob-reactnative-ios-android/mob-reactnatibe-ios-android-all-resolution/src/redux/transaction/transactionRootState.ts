export interface RootState {
  loading: boolean;
  error: string;
  orderRequest: orderRequest;
  transactionData: transactionData[];
}

export interface orderRequest {
  userId: number;
}

export interface transactionData {
  transactionId: number;
  userId: number;
  orderId: number;
  credit: number;
  debit: number;
  dateTime: string;
  adminUserId: number;
  itemId: number;
  quantity: number;
  status: string;
  amount: number;
  adminUserName: string;
  userName: string;
  nameHindi: string;
  walletAmount: number;
  itemName: string;
  itemNameHindi: string;
}
