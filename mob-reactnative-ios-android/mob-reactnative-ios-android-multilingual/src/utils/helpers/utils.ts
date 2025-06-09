import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform, ToastAndroid, Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import { globalStyles } from '../../globalStyles';
import messaging from '@react-native-firebase/messaging';
import { fetchAllOrders } from '../../containers/Order/redux/slice';

export const Toaster = (message: string) => {
  if (Platform.OS === 'android') {
    ToasterAndroid(message);
  } else {
    ToasteriOS(message);
  }
};

export const ToasterAndroid = (message: string) => {
  ToastAndroid.showWithGravityAndOffset(
    `${message}`,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

export const ToasteriOS = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    opacity: 1,
    onShow: () => {
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
    },
  });
};

export const saveInStore = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn('Unable to Store Error: ', e);
  }
};

export const fetchFromStore = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.warn('Unable to Get Error: ', e);
  }
};

export const connectionInfo = () => {
  NetInfo.fetch()
    .then((state) => {
      return {
        connectionType: state.type,
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        details: state.details,
      };
    })
    .catch((error) => {
      console.warn('NetInfo Error: ', error);
      return error;
    });
};

export const removeFromStore = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (e) {
    console.warn('Unable to Store Error: ', e);
  }
};

// firebase utils functions

export const getNotificationPermission = async () => {
  const authorizationStatus = await messaging().requestPermission({
    announcement: true,
    alert: true,
    criticalAlert: true,
    providesAppNotificationSettings: false,
    provisional: false,
    sound: true,
  });

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
  }
};

export const backgroundNotificationHandler = () => {
  // Register background handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });
};

export const getNotificationToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  return token;
};

export const validString = (str: string) => {
  return str !== null && str !== undefined && str !== '';
};

export const trimString = (str: string) => {
  return validString(str) ? str.toString().trim() : '';
};
