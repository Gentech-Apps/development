import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { navigationInitialState } from './initialState';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: navigationInitialState,
  reducers: {
    // updateNav: (state: navigationState[], action: PayloadAction<navigationState>) => {
    //   state.map((nav) => {
    //     if (nav.name === action.payload.name) {
    //       nav.active = true;
    //     } else {
    //       nav.active = false;
    //     }
    //   });
    // },

    updateNotificationNavigate: (state: any, action: PayloadAction<string>) => {
      state.notificationNavigate = action.payload;
    },
  },
});

export const { updateNotificationNavigate } = navigationSlice.actions;
export default navigationSlice.reducer;
