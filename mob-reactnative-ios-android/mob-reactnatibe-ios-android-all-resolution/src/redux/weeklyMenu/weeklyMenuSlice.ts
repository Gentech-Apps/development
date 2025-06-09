import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setState } from '../../utils/asyncStorage';
import { initialState } from './weeklyMenuInitialState';
import { suggestionRequest } from './weeklyMenuRootState';

const weeklyMenuSlice = createSlice({
  name: 'weeklyMenu',
  initialState,
  reducers: {
    getAllWeeklyMenu: (state) => {
      state.loading = true;
      state.error = '';
    },
    getAllWeeklyMenuSuccess: (state, actions: PayloadAction<any>) => {
      state.weeklyMenuData = actions.payload;
      state.loading = false;
      setState('WeeklyMenu', JSON.stringify(actions.payload));
    },
    getAllWeeklyMenuFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.loading = false;
    },
    clearSuggestionRequest: (state) => {
      state.suggestionRequest = initialState.suggestionRequest;
    },
    updateSuggestionRequest: (
      state,
      action: PayloadAction<{ name: string; value: any; form?: string }>,
    ) => {
      const form = action.payload.form ? action.payload.form : 'form';
      const { name, value } = action.payload;
      if (name === 'categoryId') {
        state.suggestionRequest.categoryId = value;
      } else if (name === 'userId') {
        state.suggestionRequest.userId = value;
      } else if (name === 'suggestion') {
        state.suggestionRequest.suggestion = value;
      } else {
        state.suggestionRequest.status = value;
      }
    },
    addSuggestion: (
      state,
      actions: PayloadAction<{ data: suggestionRequest; callback: () => void }>,
    ) => {
      state.loading = true;
      state.error = '';
    },
    addSuggestionSuccess: (state, actions: PayloadAction<any>) => {
      state.loading = false;
    },
    addSuggestionFailed: (state, actions: PayloadAction<any>) => {
      state.error = actions.payload;
      state.loading = false;
    },
    updateAllWeeklyMenu: (state, actions: PayloadAction<any>) => {
      state.weeklyMenuData = actions.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = weeklyMenuSlice;
