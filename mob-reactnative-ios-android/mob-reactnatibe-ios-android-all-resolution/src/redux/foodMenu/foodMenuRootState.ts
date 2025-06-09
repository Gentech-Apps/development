export interface RootState {
  loading: boolean;
  error: string;
  foodMenuCatData: menuCategory[];
  menus: menus[];
  saveOrder: saveOrderData;
  savefeddback: saveFeedbackData;
  serverDateTime: boolean;
}

export interface saveFeedbackData {
  itemId: number;
  rating: number;
  comment: string;
  userId: number;
}

export interface saveOrderData {
  quantity: number;
  itemId: number;
  deviceId: string;
  status: string;
  userId: number;
}

export interface menuCategory {
  categoryId: number;
  categoryName: string;
  foodList: menus[];
}

export interface menus {
  itemName: string;
  itemPrice: number;
  status: string;
  itemNameHindi: string;
  categoryId: number;
  item: string;
  message: string;
  categoryName: string;
  averageRating: string;
  id: number;
}
