import React from 'react';
import { StyleSheet } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import AppNavigationSub from './AppNavigationSub';
// import { foregroundNotificationListner, getNotificationPermission } from '../../utils/firebase';

export default function AppNavigation() {
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <AppNavigationSub />
      </RootSiblingParent>
    </Provider>
  );
}

const styles = StyleSheet.create({});
