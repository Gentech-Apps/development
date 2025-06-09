import React, { Fragment, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableHighlight,
  View,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../ThemeProvider';
import { globalStyles } from '../../globalStyles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  AUTHENTICATING_HI,
  EMAIL_PLACEHOLDER_HI,
  EMAIL_REQUIRED_HI,
  INVALID_CREDENTIALS_HI,
  LOGIN_HI,
  LOGIN_SUCCESS_HI,
  NO_INTERNET_CONNECTION_HI,
  PASSWORD_PLACEHOLDER_HI,
  PASSWORD_REQUIRED_HI,
} from '../../utils/constants';
import {
  Toaster,
  fetchFromStore,
  getNotificationToken,
  saveInStore,
} from '../../utils/helpers/utils';
import LoaderWithText from '../Reusables/LoaderWithText';
import {
  resetLogin,
  resetLoginError,
  setEmail,
  setNotification,
  setPassword,
  validateUser,
} from './redux/slice';
import { styles } from './styles';

const LOGO = require('../../assets/images/logo.png');

const { width, height } = Dimensions.get('window');
const Login = () => {
  const { theme } = useTheme();
  const { networkStatus } = useAppSelector((state) => state.network);
  let { email, password, notificationToken, error, loading } = useAppSelector(
    (state) => state.login.login,
  );
  const dispatch = useAppDispatch();
  const [togglePassword, setTogglePassword] = useState(false);
  const [emailFieldFocusColor, setEmailFieldFocusColor] = useState(
    theme.inputFieldDefaultColor.backgroundColor,
  );
  const [passwordFieldFocusColor, setPasswordFieldFocusColor] = useState(
    theme.inputFieldDefaultColor.backgroundColor,
  );

  useEffect(() => {
    if (error) {
      Toaster(INVALID_CREDENTIALS_HI);
      dispatch(resetLoginError());
    }
  }, [error]);

  useEffect(() => {
    const getToken = async () => {
      const token = await getNotificationToken();
      dispatch(setNotification(token));
    };
    getToken();
  }, []);

  const signIn = () => {
    if (!email) {
      Toaster(EMAIL_REQUIRED_HI);
      return false;
    }
    if (!password) {
      Toaster(PASSWORD_REQUIRED_HI);
      return false;
    }
    dispatch(
      validateUser({ login: { email, password, notificationToken }, _callback: onCallBack }),
    );
  };

  const onCallBack = () => {
    fetchFromStore('welcome_message').then((res: string) => {
      if (res !== 'true') {
        saveInStore('welcome_message', 'true');
        Toaster(LOGIN_SUCCESS_HI);
      }
    });
    dispatch(resetLogin());
  };

  const handleFoucsOfTextInput = (e) => {
    if (e._dispatchInstances.memoizedProps.nativeID === 'email') {
      setEmailFieldFocusColor(theme.inputFieldFocusColor.backgroundColor);
    } else {
      setEmailFieldFocusColor(theme.inputFieldDefaultColor.backgroundColor);
    }
    if (e._dispatchInstances.memoizedProps.nativeID === 'password')
      setPasswordFieldFocusColor(theme.inputFieldFocusColor.backgroundColor);
    else {
      setPasswordFieldFocusColor(theme.inputFieldDefaultColor.backgroundColor);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <LoaderWithText text={AUTHENTICATING_HI} />
      ) : (
        <SafeAreaView style={theme.container.backgroundColor}>
          <StatusBar backgroundColor={globalStyles.secondary.color} barStyle={'dark-content'} />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            style={theme.container.backgroundColor}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[theme.container, styles.sectionContainer, { paddingVertical: height / 4.5 }]}
            >
              <Image style={styles.logoImage} source={LOGO} />
              <TextInput
                id="email"
                style={[theme.inputField, { backgroundColor: emailFieldFocusColor }]}
                placeholder={EMAIL_PLACEHOLDER_HI}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => {
                  dispatch(setEmail(text));
                }}
                onFocus={(e) => handleFoucsOfTextInput(e)}
                outlineColor={globalStyles.primary.color}
                selectionColor={globalStyles.primary.color}
                underlineColorAndroid={globalStyles.primary.color}
                underlineStyle={{
                  backgroundColor: globalStyles.primary.color,
                  borderBottomColor: globalStyles.primary.color,
                }}
              />
              <TextInput
                id="password"
                onFocus={(e) => handleFoucsOfTextInput(e)}
                style={[theme.inputField, { backgroundColor: passwordFieldFocusColor }]}
                secureTextEntry={!togglePassword ? true : false}
                placeholder={PASSWORD_PLACEHOLDER_HI}
                value={password}
                onChangeText={(text) => {
                  dispatch(setPassword(text));
                }}
                outlineColor={globalStyles.primary.color}
                selectionColor={globalStyles.primary.color}
                underlineColorAndroid={globalStyles.primary.color}
                underlineStyle={{
                  backgroundColor: globalStyles.primary.color,
                  borderBottomColor: globalStyles.primary.color,
                }}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialIcons
                        name={!togglePassword ? 'visibility-off' : 'visibility'}
                        size={25}
                      />
                    )}
                    onPress={() => setTogglePassword(!togglePassword)}
                  />
                }
              />
              <TouchableHighlight
                onPress={() =>
                  networkStatus.isConnected && networkStatus.isInternetReachable
                    ? signIn()
                    : Toaster(NO_INTERNET_CONNECTION_HI)
                }
                style={[globalStyles.btnFullWidth, { backgroundColor: globalStyles.primary.color }]}
                disabled={loading}
                underlayColor={globalStyles.btnUnderlayColor.color}
                aria-disabled={loading}
              >
                <Text style={globalStyles.btnText}>{LOGIN_HI}</Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default Login;
