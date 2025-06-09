import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { orderInitialState } from './initialState';
import { orderItem, orderState, updateOrderRequest } from './interface';
import { saveInStore } from '../../../utils/helpers/utils';

export const orderSlice = createSlice({
  name: 'order',
  initialState: orderInitialState,
  reducers: {
    fetchAllOrders: (state: orderState) => {
      state.loading = true;
    },
    success: (state: orderState, actions: PayloadAction<{ ordersForVendorList: orderItem[] }>) => {
      state.loading = false;
      state.orderList = actions.payload.ordersForVendorList;
      saveInStore('orders', JSON.stringify(actions.payload.ordersForVendorList));
    },
    failed: (state: orderState, actions: PayloadAction<any>) => {
      state.loading = false;
    },
    updateOrder: (
      state: orderState,
      actions: PayloadAction<{ orderDetails: updateOrderRequest; _callback: () => void }>,
    ) => {
      state.loading = true;
    },
    updateAllOrders: (
      state: orderState,
      actions: PayloadAction<{ ordersForVendorList: orderItem[] }>,
    ) => {
      state.orderList = actions.payload.ordersForVendorList;
    },
  },
});

export const { fetchAllOrders, success, failed, updateOrder, updateAllOrders } = orderSlice.actions;
export default orderSlice.reducer;
