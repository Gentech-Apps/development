import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../globalStyles';
import { actions } from '../../redux/transaction/transactionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getState } from '../../utils/asyncStorage';
import { PLEASE_CHECK_YOUR_CONNECTION } from '../../utils/constant';
import { trimString } from '../../utils/helper';
import { showToastWithGravity } from '../../utils/toastAndriod';
import CommonWrapper from '../CommonWrapper';
let { width } = Dimensions.get('window');

const Transaction = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { notificationNavigate, networkStatus } = useAppSelector((state) => state.networkReducer);
  const [refreshing, setRefreshing] = useState(false);
  let { userId } = useAppSelector((state) => state.loginReducer.login);
  let loading = useAppSelector((state) => state.transactionReducer.loading);

  const { transactionData } = useAppSelector((state) => state.transactionReducer);

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
    const data = await getState('Transaction');
    if (data) {
      dispatch(actions.updateAllOrdersHistory(JSON.parse(data)));
    }
  };

  const onInit = () => {
    NetInfo.fetch()
      .then((state) => {
        if (state.isConnected && state.isInternetReachable) {
          dispatch(actions.getAllOrdersHistory({ userId: userId }));
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

  const getStatusStyle = (debit: number, adminUserId: number) => {
    const baseTextStyle = {
      padding: 10,
    };

    let statusTextStyle = {};

    if (debit > 0 && adminUserId > 0) {
      statusTextStyle = {
        color: 'orange',
        fontWeight: 'bold',
      };
    } else if (debit > 0) {
      statusTextStyle = {
        color: 'red',
        fontWeight: 'normal',
      };
    } else {
      statusTextStyle = {
        color: 'green',
        fontWeight: 'normal',
      };
    }

    return { ...baseTextStyle, ...statusTextStyle };
  };

  return (
    <Fragment>
      <CommonWrapper loading={loading} onInit={onInit} disableScrollView={false}>
        <View style={styles.transactionSec}>
          {transactionData.length > 0
            ? transactionData.map((item, index) => (
                <View
                  key={item?.transactionId}
                  style={[
                    styles.orderList,
                    index === transactionData?.length && styles.orderListNoBorder,
                  ]}
                >
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusTextName} numberOfLines={1}>
                      {' '}
                      {item?.debit > 0 && item?.adminUserId > 0
                        ? 'Refund from Wallet'
                        : item?.debit > 0
                        ? 'Paid for ' + trimString(item?.itemName) + ` (${item.quantity})`
                        : 'Recharge to Wallet'}{' '}
                    </Text>
                    <Text style={styles.statusDate}>{trimString(item?.dateTime)}</Text>
                  </View>
                  <View>
                    <Text style={[getStatusStyle(item?.debit, item?.adminUserId), styles.price]}>
                      {item?.credit ? item?.credit : item?.debit}
                    </Text>
                  </View>
                </View>
              ))
            : null}
        </View>
      </CommonWrapper>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  transactionSec: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDate: { width: '100%', color: globalStyles.placeholderText.color },
  statusContainer: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 20 },
  statusTextName: {
    marginLeft: -5,
    marginTop: 20,
    // fontWeight: '700',
    color: globalStyles.primaryText.color,
    width: width - 100,
    fontSize: width === 360 ? globalStyles.font_16.fontSize : globalStyles.font_18.fontSize,
  },
  statusText: { fontSize: 16, marginRight: 10, marginTop: 20 },
  orderList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    width: Platform.OS === 'ios' ? width - 10 : '100%',
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.placeholderText.color,
    paddingBottom: 5,
  },
  orderListNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    width: '100%',
    borderBottomWidth: 0,
  },
  price: {
    fontSize: width === 360 ? globalStyles.font_18.fontSize : globalStyles.font_20.fontSize,
  },
});

export default Transaction;
