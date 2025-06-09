import messaging from '@react-native-firebase/messaging';
import React, { Fragment, useEffect, useState } from 'react';
import Login from './containers/Login/Login';
import { setEmail, setPassword, updateUserData } from './containers/Login/redux/slice';
import { fetchAllOrders } from './containers/Order/redux/slice';
import LoaderWithText from './containers/Reusables/LoaderWithText';
import NetworkStatus from './containers/Reusables/NetworkStatus/NetworkStatus';
import BottomNavigation from './navigations/BottomNavigation';
import { updateNotificationNavigate } from './navigations/redux/slice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ORDER_RECEIVED_HI, PLEASE_WAIT_HI } from './utils/constants';
import { Toaster, fetchFromStore } from './utils/helpers/utils';

const AppProvider = () => {
  const { networkStatus } = useAppSelector((state) => state.network);
  const { user } = useAppSelector((state) => state.login);
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState(false);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      dispatch(updateNotificationNavigate('ऑर्डर'));
    });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      dispatch(updateNotificationNavigate('ऑर्डर'));
      setTimeout(() => {
        dispatch(updateNotificationNavigate(''));
      }, 100);
    });

    messaging().onMessage(async (remoteMessage) => {
      dispatch(fetchAllOrders());
      if (remoteMessage?.data?.body) {
        Toaster(String(`${remoteMessage.data.body}  ${ORDER_RECEIVED_HI}`));
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          dispatch(updateNotificationNavigate('ऑर्डर'));
        }
      });
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [JSON.stringify(networkStatus)]);

  const fetchUserData = async () => {
    const data = await fetchFromStore('user');
    if (!data) {
      // Toaster(PLEASE_LOGIN_HI);
      setUserData(true);
    } else if (JSON.parse(data).hasOwnProperty('userId')) {
      // Toaster(LOGIN_SUCCESS_HI);
      setTimeout(() => {
        let userdata = JSON.parse(data);
        dispatch(setEmail(userdata.email));
        dispatch(setPassword(userdata.password));
        dispatch(updateUserData({ login: JSON.parse(data) }));
        setUserData(true);
      }, 1000);
    }
  };

  return (
    <Fragment>
      <NetworkStatus />
      {!userData ? (
        <LoaderWithText text={PLEASE_WAIT_HI} />
      ) : user?.token && user?.token !== '' ? (
        <BottomNavigation />
      ) : (
        <Login />
      )}
    </Fragment>
  );
};

export default AppProvider;
