import messaging from '@react-native-firebase/messaging';
import { Fragment, useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import LoadingScreen from '../../components/LoadingScreen';
import NetworkStatus from '../../components/NetworkStatus';
import { actions, actions as loginActions } from '../../redux/login/loginSlice';
import { actions as networkActions } from '../../redux/networkStatus/networkStatusSlice';
import { actions as OrderActions } from '../../redux/orderStatus/orderStatusSlice';
import { actions as TransactionActions } from '../../redux/transaction/transactionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getState, removeState, setState } from '../../utils/asyncStorage';
import { LOGIN_SUCCESSFULL, YOUR_ORDER_HAS_BEEN_CANCELED } from '../../utils/constant';
import { showToastWithGravity } from '../../utils/toastAndriod';
import HomeTabs from './HomeTabs';
import LoginStack from './LoginStacks';

const AppNavigationSub = () => {
  const [userData, setUserData] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const userRequest = useAppSelector((state) => state.loginReducer.login);
  const networkStatus = useAppSelector((state) => state.networkReducer.networkStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      let noti_nav_screen =
        remoteMessage?.data?.body?.toString().includes('credited') ||
        remoteMessage?.data?.body?.toString().includes('debited')
          ? 'Transaction'
          : 'Order Status';
      dispatch(networkActions.updateNotificationNavigate(noti_nav_screen));
      setTimeout(() => {
        dispatch(networkActions.updateNotificationNavigate(''));
      }, 100);
    });

    messaging().onMessage(async (remoteMessage) => {
      let authData = await getState('auth');
      if (
        remoteMessage?.data?.body?.toString().includes('delivered') ||
        remoteMessage?.data?.body?.toString().includes('cancel')
      ) {
        dispatch(OrderActions.getAllOrders({ userId: JSON.parse(authData).userId }));
        if (remoteMessage.data.body === 'Your order has been cancel') {
          showToastWithGravity(YOUR_ORDER_HAS_BEEN_CANCELED);
        } else {
          showToastWithGravity(String(`${remoteMessage.data.body}`));
        }
      }
      if (
        remoteMessage?.data?.body?.toString().includes('credited') ||
        remoteMessage?.data?.body?.toString().includes('debited')
      ) {
        dispatch(TransactionActions.getAllOrdersHistory({ userId: JSON.parse(authData).userId }));
        showToastWithGravity(String(`${remoteMessage.data.body}`));
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        let noti_nav_screen =
          remoteMessage?.data?.body?.toString().includes('credited') ||
          remoteMessage?.data?.body?.toString().includes('debited')
            ? 'Transaction'
            : 'Order Status';
        if (remoteMessage) {
          dispatch(networkActions.updateNotificationNavigate(noti_nav_screen));
          // setTimeout(() => {
          //   dispatch(networkActions.updateNotificationNavigate(''));
          // }, 5000);
        }
      });
  }, []);

  useEffect(() => {
    // Get the device ID
    const getDeviceId = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        setState('deviceId', id);
      } catch (error) {
        console.error('Error getting device ID:', error);
      }
    };

    // Get the device model name
    const getDeviceModel = async () => {
      try {
        const model = await DeviceInfo.getDeviceName();
        setState('deviceModel', model);
      } catch (error) {
        console.error('Error getting device model:', error);
      }
    };

    const checkLoginDeviceId = async () => {
      const deviceId = await getState('deviceId');
      if (deviceId === null) {
        dispatch(loginActions.setLoginDeviceId(true));
      }
    };

    checkLoginDeviceId().then(() => {
      getDeviceId();
      getDeviceModel();
    });
  }, [userRequest]);

  useEffect(() => {
    getFinalDeviceId();
  }, [userRequest]);

  const getFinalDeviceId = async () => {
    const storedDeviceId = await getState('deviceId');
    const storedDeviceModel = await getState('deviceModel');
    dispatch(
      actions.setSaveUserData({
        name: 'deviceId',
        value: storedDeviceModel + '' + storedDeviceId,
        form: 'saveUserData',
      }),
    );

    return storedDeviceModel + '' + storedDeviceId;
  };

  useEffect(() => {
    const fetchUser = async () => {
      let authData = await getState('auth');
      if (JSON.parse(authData).hasOwnProperty('userId')) {
        let authDataRes = JSON.parse(authData);
        dispatch(
          actions.setSaveUserData({ name: 'name', value: authDataRes?.name, form: 'saveUserData' }),
        );
        dispatch(
          actions.setSaveUserData({
            name: 'deviceId',
            value: authDataRes?.deviceId,
            form: 'saveUserData',
          }),
        );
        dispatch(
          actions.setSaveUserData({
            name: 'email',
            value: authDataRes?.email,
            form: 'saveUserData',
          }),
        );
        dispatch(
          actions.setSaveUserData({
            name: 'password',
            value: authDataRes?.password,
            form: 'saveUserData',
          }),
        );
        dispatch(
          actions.setSaveUserData({
            name: 'company',
            value: authDataRes?.company,
            form: 'saveUserData',
          }),
        );
        dispatch(
          actions.setSaveUserData({
            name: 'notificationToken',
            value: authDataRes?.notificationToken,
            form: 'saveUserData',
          }),
        );
        dispatch(
          actions.setSaveUserData({
            name: 'userId',
            value: authDataRes?.userId,
            form: 'saveUserData',
          }),
        );
        dispatch(
          actions.setSaveUserData({
            name: 'message',
            value: authDataRes?.message,
            form: 'saveUserData',
          }),
        );
      }
      setLogin(false);
      setUserData(true);
    };

    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      getStoredData();
    } else {
      setTimeout(() => {
        fetchUser();
      }, 1000);
    }
  }, [JSON.stringify(networkStatus)]);

  useEffect(() => {
    if (isLogin) {
      dispatch(actions.login({ data: userRequest }));
      setTimeout(() => {
        setUserData(true);
        setLogin(false);
      }, 1000);
    }
  }, [isLogin]);

  const getStoredData = async () => {
    let authData = await getState('auth');
    if (!authData) {
      setUserData(true);
      setLogin(false);
      removeState();
      return;
    } else if (JSON.parse(authData).hasOwnProperty('userId')) {
      let authDataRes = JSON.parse(authData);
      dispatch(
        actions.setSaveUserData({ name: 'name', value: authDataRes?.name, form: 'saveUserData' }),
      );
      dispatch(
        actions.setSaveUserData({
          name: 'deviceId',
          value: authDataRes?.deviceId,
          form: 'saveUserData',
        }),
      );
      dispatch(
        actions.setSaveUserData({ name: 'email', value: authDataRes?.email, form: 'saveUserData' }),
      );
      dispatch(
        actions.setSaveUserData({
          name: 'password',
          value: authDataRes?.password,
          form: 'saveUserData',
        }),
      );
      dispatch(
        actions.setSaveUserData({
          name: 'company',
          value: authDataRes?.company,
          form: 'saveUserData',
        }),
      );
      dispatch(
        actions.setSaveUserData({
          name: 'notificationToken',
          value: authDataRes?.notificationToken,
          form: 'saveUserData',
        }),
      );
      dispatch(
        actions.setSaveUserData({
          name: 'userId',
          value: authDataRes?.userId,
          form: 'saveUserData',
        }),
      );
      dispatch(
        actions.setSaveUserData({
          name: 'message',
          value: authDataRes?.message,
          form: 'saveUserData',
        }),
      );
      setLogin(true);
    }
  };
  return (
    <Fragment>
      <NetworkStatus />
      {!userData ? (
        <LoadingScreen />
      ) : userRequest?.userId &&
        userRequest?.name &&
        userRequest?.deviceId &&
        userRequest?.message === LOGIN_SUCCESSFULL ? (
        <HomeTabs />
      ) : (
        <LoginStack />
      )}
    </Fragment>
  );
};

export default AppNavigationSub;
