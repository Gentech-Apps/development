export const saveOrderData = {
  quantity: 1,
  itemId: 0,
  deviceId: '',
  status: 'pending',
  userId: 0,
};
export const saveFeedbackData = {
  itemId: 0,
  rating: 0,
  comment: '',
  userId: 0,
};

export const initialState = {
  loading: false,
  error: '',
  foodMenuCatData: [],
  menus: [],
  saveOrder: saveOrderData,
  saveFeedback: saveFeedbackData,
  serverDateTime: true,
};
