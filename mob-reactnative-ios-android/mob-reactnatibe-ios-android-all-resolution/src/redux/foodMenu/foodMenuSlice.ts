import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setState } from '../../utils/asyncStorage';
import { initialState } from './foodMenuInitialState';
import { saveFeedbackData, saveOrderData } from './foodMenuRootState';

const foodMenuSlice = createSlice({
  name: 'foodMenu',
  initialState,
  reducers: {
    getAllMenuCategory: (state) => {
      state.loading = true;
      state.error = '';
    },
    getAllMenuCategorySuccess: (state, actions: PayloadAction<any>) => {
      state.foodMenuCatData = actions.payload;
      state.loading = false;
    },
    getAllMenuCategoryFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.loading = false;
    },
    getAllMenusViaCategory: (state) => {
      state.loading = true;
      state.error = '';
    },
    getAllMenusViaCategorySuccess: (state, actions: PayloadAction<[]>) => {
      state.foodMenuCatData = actions.payload;
      state.loading = false;
      setState('FoodMenu', JSON.stringify(actions.payload));
    },
    getAllMenusViaCategoryFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.loading = false;
    },
    setSaveOrderData: (
      state,
      action: PayloadAction<{ name: string; value: any; form?: string }>,
    ) => {
      const form = action.payload.form ? action.payload.form : 'form';
      const { name, value } = action.payload;
      if (name === 'quantity') {
        state.saveOrder.quantity = value;
      } else if (name === 'itemId') {
        state.saveOrder.itemId = value;
      } else if (name === 'deviceId') {
        state.saveOrder.deviceId = value;
      } else {
        state.saveOrder.userId = value;
      }
    },
    saveOrder: (state, actions: PayloadAction<{ data: saveOrderData; callback: () => void }>) => {
      state.loading = true;
      state.error = '';
    },
    saveOrderSuccess: (state, actions: PayloadAction<any>) => {
      state.loading = false;
    },
    saveOrderFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.loading = false;
    },
    setFeedbackData: (
      state,
      action: PayloadAction<{ name: string; value: any; form?: string }>,
    ) => {
      const { name, value } = action.payload;
      if (name === 'userId') {
        state.saveFeedback.userId = value;
      } else if (name === 'itemId') {
        state.saveFeedback.itemId = value;
      } else if (name === 'rating') {
        state.saveFeedback.rating = value;
      } else {
        state.saveFeedback.comment = value;
      }
    },
    saveFeedback: (
      state,
      actions: PayloadAction<{ data: saveFeedbackData; callback: () => void }>,
    ) => {
      state.loading = true;
      state.error = '';
    },
    saveFeedbackSuccess: (state) => {
      state.loading = false;
    },
    saveFeedbackFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.loading = false;
    },
    resetFeedbackData: (state) => {
      state.saveFeedback = initialState.saveFeedback;
    },
    updateAllMenusViaCategory: (state, actions: PayloadAction<[]>) => {
      state.foodMenuCatData = actions.payload;
    },
    getServerDateTime: (state) => {
      state.loading = true;
      state.error = '';
    },
    setServerDateTime: (state, actions: PayloadAction<boolean>) => {
      state.serverDateTime = actions.payload;
      state.loading = false;
    },
    setErrorServerDateTime: (state, actions: PayloadAction<string>) => {
      state.error = actions.payload;
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = foodMenuSlice;
