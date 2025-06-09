import NetInfo from '@react-native-community/netinfo';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from '../../globalStyles';
import { useAppSelector } from '../../store/hooks';
import { getState } from '../../utils/asyncStorage';
import { TRANSACTION } from '../../utils/constant';
import { trimString } from '../../utils/helper';
let { width } = Dimensions.get('window');

const Header = () => {
  const [wallet, setWallet] = useState(0);

  const route = useRoute();

  let { name, walletAmount } = useAppSelector((state) => state.loginReducer.login);

  useEffect(() => {
    setWallet(walletAmount);
    fetchWallet();
  }, [walletAmount]);

  const fetchWallet = async () => {
    NetInfo.fetch()
      .then(async (state) => {
        if (!state.isConnected && !state.isInternetReachable) {
          const authData = await getState('auth');
          if (JSON.parse(authData).hasOwnProperty('userId')) {
            setWallet(JSON.parse(authData).walletAmount);
          }
        }
      })
      .catch((error) => {
        console.warn('NetInfo Error: ', error);
        return error;
      });
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.UserName}>{trimString(name)}</Text>
      {route.name === TRANSACTION && (
        <View style={styles.routeNameContainer}>
          <Icon name={'account-balance-wallet'} size={20} color={'white'} />
          <Text style={styles.wallet}>{wallet}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  UserName: {
    flexDirection: 'row',
    fontWeight: '600',
    paddingRight: 10,
    fontSize: width === 360 ? globalStyles.font_16.fontSize : globalStyles.font_18.fontSize,
    color: globalStyles.secondary.color,
  },
  routeNameContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  wallet: {
    fontWeight: '600',
    paddingRight: 10,
    fontSize: width === 360 ? globalStyles.font_16.fontSize : globalStyles.font_18.fontSize,
    color: globalStyles.secondary.color,
    marginLeft: 10,
  },
});

export default Header;
