import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NetworkData, networkInitialState } from './initialState';
import { NetworkStatus, networkState } from './interface';

export const networkSlice = createSlice({
  name: 'network',
  initialState: networkInitialState,
  reducers: {
    updateNetworkStatus: (state: networkState, actions: PayloadAction<NetworkStatus>) => {
      state.networkStatus = actions.payload;
    },
    updateNetworkState: (state: networkState) => {
      const { isConnected, isInternetReachable, details, isWifiEnabled, type } =
        state.networkStatus;
      if (isConnected && isInternetReachable) {
        state.bgColor = NetworkData.connected.background_color;
        state.textColor = NetworkData.connected.text_color;
        state.text = NetworkData.connected.text;
      } else if (isConnected && !isInternetReachable) {
        state.bgColor = NetworkData.internetReachable.background_color;
        state.textColor = NetworkData.internetReachable.text_color;
        state.text = NetworkData.internetReachable.text;
      } else {
        state.bgColor = NetworkData.disconnected.background_color;
        state.textColor = NetworkData.disconnected.text_color;
        state.text = NetworkData.disconnected.text;
      }
    },
    toggleStatusBar: (state: networkState, actions: PayloadAction<boolean>) => {
      state.toggle = actions.payload;
    },
  },
});

export const { updateNetworkStatus, updateNetworkState, toggleStatusBar } = networkSlice.actions;
export default networkSlice.reducer;
