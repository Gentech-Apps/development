import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setState } from '../../utils/asyncStorage';
import { initialState } from './transactionInitialState';
import { transactionData } from './transactionRootState';

const transactionSlice = createSlice({
  name: 'oerderHistory',
  initialState,
  reducers: {
    getAllOrdersHistory: (state, actions: PayloadAction<{ userId: string }>) => {
      state.loading = true;
      state.error = '';
    },
    getAllOrdersHistorySuccess: (state, actions: PayloadAction<transactionData[]>) => {
      state.transactionData = actions.payload;
      state.loading = false;
      setState('Transaction', JSON.stringify(actions.payload));
    },
    getAllOrdersHistoryFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.loading = false;
    },
    updateAllOrdersHistory: (state, actions: PayloadAction<[]>) => {
      state.transactionData = actions.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = transactionSlice;
