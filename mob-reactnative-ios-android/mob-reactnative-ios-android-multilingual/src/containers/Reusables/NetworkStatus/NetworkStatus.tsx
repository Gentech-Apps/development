import NetInfo from '@react-native-community/netinfo';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../../globalStyles';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleStatusBar, updateNetworkState, updateNetworkStatus } from './redux/slice';
import { trimString } from '../../../utils/helpers/utils';

const NetworkStatus = () => {
  const dispatch = useAppDispatch();
  const { networkStatus, bgColor, textColor, text, toggle } = useAppSelector(
    (state) => state.network,
  );
  // Use useEffect hook to subscribe and unsubscribe to network state updates
  useEffect(() => {
    // Get the network state once
    NetInfo.fetch().then((state) => {
      dispatch(updateNetworkStatus(state));
      dispatch(updateNetworkState());
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(updateNetworkStatus(state));
      dispatch(updateNetworkState());
    });

    // Unsubscribe from network state updates
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (networkStatus.isConnected && networkStatus.isInternetReachable) {
        dispatch(toggleStatusBar(false));
      } else {
        dispatch(toggleStatusBar(true));
      }
    }, 3000);
  }, [networkStatus]);

  // Return a view with a text and a color indicator
  return (
    <View
      style={[
        globalStyles.NetworkContainer,
        { backgroundColor: bgColor },
        { display: toggle ? 'flex' : 'none' },
      ]}
    >
      <Text style={[globalStyles.NetworkText, { color: textColor }]}>{trimString(text)}</Text>
    </View>
  );
};

export default NetworkStatus;
