import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useTheme } from '../../ThemeProvider';
import { globalStyles } from '../../globalStyles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFromStore } from '../../utils/helpers/utils';
import Wrapper from '../Reusables/Wrapper';
import TransactionItems from './components/TransactionItems';
import { fetchTransactionHistory, updateTransactionHistory } from './redux/slice';

const Transaction = ({ navigation }) => {
  const { theme } = useTheme();
  const { networkStatus } = useAppSelector((state) => state.network);
  const { loading, transactionHistoryList } = useAppSelector((state) => state.transaction);
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
    const data = await fetchFromStore('transaction');
    const { allTransactionHistory, totalDebit } = JSON.parse(data);
    dispatch(updateTransactionHistory({ allTransactionHistory, totalDebit }));
  };

  const onInit = () => {
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      dispatch(fetchTransactionHistory());
    } else {
      setDataToState();
    }
  };

  return (
    <Wrapper
      loading={loading}
      onInit={onInit}
      disableScrollView={transactionHistoryList?.length > 0 ? true : false}
    >
      <View style={[theme.container]}>
        {transactionHistoryList?.length > 0 ? (
          <FlatList
            data={transactionHistoryList}
            renderItem={(transaction) => <TransactionItems transactionData={transaction} />}
            keyExtractor={(transaction) => transaction.transactionId}
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

export default Transaction;
