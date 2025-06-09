import messaging from '@react-native-firebase/messaging';

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
    // console.log('Message handled in the background!', remoteMessage);
  });
};

export const getNotificationToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  return token;
};
