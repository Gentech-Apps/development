import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from '../../globalStyles';
import { actions as foodMenuActions } from '../../redux/foodMenu/foodMenuSlice';
import { actions } from '../../redux/orderStatus/orderStatusSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getState } from '../../utils/asyncStorage';
import { PLEASE_CHECK_YOUR_CONNECTION } from '../../utils/constant';
import { trimString } from '../../utils/helper';
import { showToastWithGravity } from '../../utils/toastAndriod';
import CommonWrapper from '../CommonWrapper';
import FeedbackModal from '../FeedbackModal';
const { width } = Dimensions.get('window');

const OrderStatus = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { notificationNavigate, networkStatus } = useAppSelector((state) => state.networkReducer);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  let { userId } = useAppSelector((state) => state.loginReducer.login);
  const { orderStatusData } = useAppSelector((state) => state.orderStatusReducer);
  let loading = useAppSelector((state) => state.orderStatusReducer.loading);

  useEffect(() => {
    if (notificationNavigate === 'Order Status') {
      navigation.navigate('Order Status');
    }
    if (notificationNavigate === 'Transaction') {
      navigation.navigate('Transaction');
    }
  }, [notificationNavigate]);

  useFocusEffect(
    useCallback(() => {
      onInit();
    }, []),
  );

  const setDataToState = async () => {
    const data = await getState('OrderStatus');
    if (data) {
      dispatch(actions.updateAllOrders(JSON.parse(data)));
    }
  };

  const onInit = () => {
    NetInfo.fetch()
      .then((state) => {
        if (state.isConnected && state.isInternetReachable) {
          dispatch(actions.getAllOrders({ userId: userId }));
        } else {
          showToastWithGravity(PLEASE_CHECK_YOUR_CONNECTION);
          setDataToState();
        }
      })
      .catch((error) => {
        console.warn('NetInfo Error: ', error);
        return error;
      });
  };

  const getStatusStyle = (status: string) => {
    const baseTextStyle = {
      padding: 10,
    };
    let statusTextStyle = {};
    if (status === 'pending') {
      statusTextStyle = {
        color: 'orange',
        fontWeight: 'bold',
      };
    } else if (status === 'delivered') {
      statusTextStyle = {
        color: 'green',
        fontWeight: 'normal',
      };
    } else {
      statusTextStyle = {
        color: globalStyles.negative.color,
        fontWeight: 'normal',
      };
    }

    return { ...baseTextStyle, ...statusTextStyle };
  };

  const openFeedbackPopup = (itemId: number, index: number) => {
    dispatch(
      foodMenuActions.setFeedbackData({ name: 'itemId', value: itemId, form: 'saveFeedback' }),
    );
    dispatch(
      foodMenuActions.setFeedbackData({ name: 'userId', value: userId, form: 'saveFeedback' }),
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    dispatch(foodMenuActions.resetFeedbackData());
    setModalVisible(false);
  };

  return (
    <Fragment>
      <CommonWrapper loading={loading} onInit={onInit} disableScrollView={false}>
        <View style={styles.orderSec}>
          {orderStatusData?.length > 0 &&
            orderStatusData?.map((item, index) => (
              <View
                key={item?.id}
                style={[
                  styles.orderList,
                  index === orderStatusData?.length && styles.orderListNoBorder,
                ]}
              >
                <View style={styles.statusContainer}>
                  <Text
                    style={[
                      styles.statusTextName,
                      width !== 360 && globalStyles.font_18,
                      width === 360 && globalStyles.font_16,
                    ]}
                    numberOfLines={1}
                  >
                    {trimString(item?.itemName)} ({item?.quantity})
                  </Text>
                  <Text style={styles.statusDate}>{trimString(item?.dateTime)}</Text>
                </View>
                {item?.status === 'delivered' ? (
                  <TouchableOpacity
                    onPress={() => openFeedbackPopup(item?.itemId, index)}
                    style={[styles.trackButton]}
                    activeOpacity={0.7}
                  >
                    <Text>
                      <Icon
                        style={[
                          { color: 'orange', fontWeight: 'normal' },
                          width !== 360 && { fontSize: 36 },
                          width === 360 && { fontSize: 28 },
                        ]}
                        name={'thumb-up-off-alt'}
                        color={'grey'}
                        // size={50}
                      />
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={[styles.trackButton]}>
                  <Text>
                    <Icon
                      style={[
                        getStatusStyle(item?.status),
                        width !== 360 && { fontSize: 36 },
                        width === 360 && { fontSize: 28 },
                      ]}
                      name={
                        item?.status === 'delivered'
                          ? 'check-circle-outline'
                          : item?.status === 'pending'
                          ? 'timelapse'
                          : 'cancel'
                      }
                      color={'grey'}
                      // size={50}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </CommonWrapper>
      <FeedbackModal visible={isModalVisible} onClose={closeModal as any} modalText="Feedback" />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  orderSec: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDate: { width: '100%', color: globalStyles.placeholderText.color },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  statusContainer: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 2, flex: 6 },
  statusTextName: {
    marginRight: 10,
    marginTop: 20,
    // fontWeight: '700',
    color: globalStyles.primaryText.color,
    fontSize: width === 360 ? globalStyles.font_16.fontSize : globalStyles.font_18.fontSize,
  },
  statusText: { fontSize: 16, marginRight: 10, marginTop: 20 },
  status: { fontSize: 16, fontWeight: 'bold' },
  trackButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButtonText: { fontSize: 40, fontWeight: 'bold' },
  mainContent: {},
  bannerSection: { height: 100, flex: 0.5, padding: 0 },
  bannerImage: { width: '100%', height: '100%' },
  orderList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    width: Platform.OS === 'ios' ? width - 10 : '100%',
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.placeholderText.color,
    paddingBottom: 15,
  },
  orderListNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    width: '100%',
    borderBottomWidth: 0,
  },
  icon: {
    color: 'orange',
    fontWeight: 'normal',
    fontSize: width === 360 ? 28 : 36,
  },
  iconButton: {
    fontSize: width === 360 ? 28 : 36,
  },
});

export default OrderStatus;
