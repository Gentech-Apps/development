import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useTheme } from '../../ThemeProvider';
import { globalStyles } from '../../globalStyles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFromStore } from '../../utils/helpers/utils';
import Wrapper from '../Reusables/Wrapper';
import OrderItems from './components/OrderItems';
import { fetchAllOrders, updateAllOrders, updateOrder } from './redux/slice';

const Order = ({ navigation }) => {
  const { theme } = useTheme();
  const { networkStatus } = useAppSelector((state) => state.network);
  const { loading, orderList } = useAppSelector((state) => state.order);
  const { notificationNavigate } = useAppSelector((state) => state.navigation);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      onInit();
    }, [networkStatus]),
  );

  useEffect(() => {
    if (notificationNavigate === 'ऑर्डर') {
      navigation.navigate('ऑर्डर');
    }
  }, [notificationNavigate]);

  const setDataToState = async () => {
    const data = await fetchFromStore('orders');
    dispatch(updateAllOrders({ ordersForVendorList: JSON.parse(data) }));
  };

  const onInit = () => {
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      dispatch(fetchAllOrders());
    } else {
      setDataToState();
    }
  };

  const handleUpdateOrder = (order: any, status: string) => {
    dispatch(
      updateOrder({
        orderDetails: {
          id: order.id,
          userId: order.user_id,
          itemId: order.item_id,
          quantity: order.quantity,
          dateTime: order.date_time,
          status: status,
          amount: order.amount,
          deviceId: order.device_id,
          rating: order.rating,
        },
        _callback: onInit,
      }),
    );
  };

  return (
    <Wrapper
      loading={loading}
      onInit={onInit}
      disableScrollView={orderList?.length > 0 ? true : false}
    >
      <View style={[theme.container]}>
        {orderList?.length > 0 ? (
          <FlatList
            data={orderList}
            renderItem={(order) => (
              <OrderItems orderData={order} handleUpdateOrder={handleUpdateOrder} />
            )}
            keyExtractor={(order) => order.id}
            refreshControl={
              <RefreshControl
                colors={[globalStyles.primary.color]}
                refreshing={loading}
                onRefresh={onInit}
              />
            }
          />
        ) : null}
      </View>
    </Wrapper>
  );
};

export default Order;
