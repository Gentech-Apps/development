import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-root-toast';
import { trimString } from './helper';

export function showToastWithGravity(message: string) {
  if (Platform.OS === 'android') {
    ToasterAndroid(trimString(message));
  } else {
    ToasteriOS(trimString(message));
  }
}

export const ToasterAndroid = (message: string) => {
  ToastAndroid.show(`${message}`, ToastAndroid.LONG);
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
