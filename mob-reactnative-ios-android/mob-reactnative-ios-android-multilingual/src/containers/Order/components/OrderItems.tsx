import React, { Fragment, useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../ThemeProvider';
import { useAppSelector } from '../../../store/hooks';
import { NO_INTERNET_CONNECTION_HI } from '../../../utils/constants';
import { Toaster, trimString } from '../../../utils/helpers/utils';

const OrderItem = ({ orderData, handleUpdateOrder }) => {
  const { theme } = useTheme();
  const { networkStatus } = useAppSelector((state) => state.network);
  const { loading, orderList } = useAppSelector((state) => state.order);
  const { nameHindi, itemNameHindi, quantity, dateTime } = orderData.item;
  const [touchedItem, setTouchedItem] = useState(null);
  const [disabledButton, setDisabledButton] = useState(false);

  const handleTouchItem = () => {
    setTouchedItem(theme.elevationItem);
  };

  const handleTouchEndItem = () => {
    setTouchedItem(null);
  };

  const enableButton = () => {
    setTimeout(() => {
      if (loading == false) {
        setDisabledButton(false);
        return;
      } else {
        enableButton();
      }
    }, 2000);
  };

  const handlePress = (orderData: any, status: string) => {
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      setDisabledButton(true);
      handleUpdateOrder(orderData.item, status);
      enableButton();
    } else {
      Toaster(NO_INTERNET_CONNECTION_HI);
    }
  };

  return (
    <Fragment>
      {trimString(nameHindi) && (
        <View
          style={[theme.borderBottomWidth, styles.itemRow, touchedItem]}
          onTouchStart={() => handleTouchItem()}
          onTouchEnd={() => handleTouchEndItem()}
          onTouchMove={() => handleTouchItem()}
          onTouchCancel={() => handleTouchEndItem()}
          onTouchEndCapture={() => handleTouchEndItem()}
        >
          <View>
            <Text style={[styles.itemHead, theme.primaryText]}>{trimString(nameHindi)}</Text>
            <Text style={[styles.itemDesc, theme.primaryText]}>
              {trimString(itemNameHindi)} ({trimString(quantity)})
            </Text>
            <Text style={[theme.primaryText, styles.itemDesc]}>{trimString(dateTime)}</Text>
          </View>
          <View style={[styles.itemRight]}>
            <TouchableHighlight
              style={styles.itemPress}
              underlayColor={theme.primaryTouchShade.color}
              onPress={() => handlePress(orderData, 'delivered')}
              disabled={disabledButton}
            >
              <MaterialIcons name={'check-circle'} color={theme.primary.color} size={60} />
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.itemPress}
              underlayColor={theme.primaryTouchShade.color}
              onPress={() => handlePress(orderData, 'cancel')}
              disabled={disabledButton}
            >
              <MaterialIcons name={'cancel'} color={theme.negative.color} size={60} />
            </TouchableHighlight>
          </View>
        </View>
      )}
    </Fragment>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  itemRow: {
    padding: 14,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 1,
  },
  itemRight: {
    textAlign: 'right',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 6,
  },
  itemHead: {
    fontSize: 20,
    fontWeight: '500',
  },
  itemDesc: {
    fontSize: 18,
  },
  itemPress: {
    borderRadius: 50,
    maxHeight: 60,
    maxWidth: 60,
  },
});
