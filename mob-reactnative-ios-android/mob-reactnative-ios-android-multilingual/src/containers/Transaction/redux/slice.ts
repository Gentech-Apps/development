import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { transactionInitialState } from './initialState';
import { Transaction, transactionState } from './interface';
import { saveInStore } from '../../../utils/helpers/utils';

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState: transactionInitialState,
  reducers: {
    fetchTransactionHistory: (state: transactionState) => {
      state.loading = true;
    },
    success: (
      state: transactionState,
      actions: PayloadAction<{ allTransactionHistory: Transaction[]; totalDebit: number | string }>,
    ) => {
      state.loading = false;
      state.transactionHistoryList = actions.payload.allTransactionHistory;
      state.totalDebit = actions.payload.totalDebit;
      saveInStore('transaction', JSON.stringify(actions.payload));
    },
    failed: (state: transactionState, actions: PayloadAction<any>) => {
      state.loading = false;
    },
    updateTransactionHistory: (
      state: transactionState,
      actions: PayloadAction<{ allTransactionHistory: Transaction[]; totalDebit: number | string }>,
    ) => {
      state.transactionHistoryList = actions.payload.allTransactionHistory;
      state.totalDebit = actions.payload.totalDebit;
    },
  },
});

export const { fetchTransactionHistory, success, failed, updateTransactionHistory } =
  transactionSlice.actions;
export default transactionSlice.reducer;
