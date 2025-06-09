export interface orderState {
  loading?: boolean;
  error?: boolean;
  message?: string;
  orderList?: orderItem[];
}

export interface orderItem {
  id: number | string;
  userId: number | string;
  itemId: number | string;
  quantity: number | string;
  dateTime: string;
  status: string;
  amount: number | string;
  deviceId: string;
  name: string;
  nameHindi: string;
  itemName: string;
  itemPrice: number | string;
  itemNameHindi: string;
  rating: number | string;
  comment: string;
}

export interface updateOrderRequest {
  id: number | string;
  userId: number | string;
  itemId: number | string;
  quantity: number | string;
  dateTime: string;
  status: string;
  amount: number | string;
  deviceId: string;
  rating: number | string;
}
