import React, { Fragment, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../ThemeProvider';
import { PAID_FOR_HI } from '../../../utils/constants';
import { trimString } from '../../../utils/helpers/utils';

const TransactionItem = ({ transactionData }) => {
  const { theme } = useTheme();
  const { nameHindi, itemNameHindi, dateTime, amount, quantity } = transactionData.item;
  const [touchedItem, setTouchedItem] = useState(null);

  const handleTouchItem = () => {
    setTouchedItem(theme.elevationItem);
  };

  const handleTouchEndItem = () => {
    setTouchedItem(null);
  };

  return (
    <Fragment>
      {trimString(itemNameHindi) && (
        <View
          style={[theme.container, theme.borderBottomWidth, styles.itemRow, touchedItem]}
          onTouchStart={() => handleTouchItem()}
          onTouchEnd={() => handleTouchEndItem()}
          onTouchMove={() => handleTouchItem()}
          onTouchCancel={() => handleTouchEndItem()}
          onTouchEndCapture={() => handleTouchEndItem()}
        >
          <View>
            <Text style={[theme.primaryText, styles.itemHead]}>{trimString(nameHindi)}</Text>
            <Text style={[styles.itemDesc, theme.primaryText]}>
              {trimString(itemNameHindi) +
                ' ' +
                trimString(PAID_FOR_HI) +
                ` (${trimString(quantity)})`}
            </Text>
            <Text style={[theme.primaryText, styles.itemDesc]}>{trimString(dateTime)}</Text>
          </View>
          <View style={[styles.itemRight]}>
            <Text style={[theme.negative, styles.price]}>{trimString(amount)}</Text>
          </View>
        </View>
      )}
    </Fragment>
  );
};

export default TransactionItem;

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
    marginRight: 10,
    justifyContent: 'center',
  },
  itemHead: {
    fontSize: 20,
    fontWeight: '500',
  },
  itemDesc: {
    fontSize: 18,
  },
  price: {
    fontSize: 26,
  },
});
