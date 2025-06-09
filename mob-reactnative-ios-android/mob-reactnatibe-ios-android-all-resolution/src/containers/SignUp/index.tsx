import React, { Fragment, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { globalStyles } from '../../globalStyles';
import { actions } from '../../redux/login/loginSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  FIRSTNAME,
  FIRSTNAME_REQUIRED,
  INVALID_DEVICE_ID,
  LASTNAME,
  LASTNAME_REQUIRED,
  OTP,
  PLEASE_CHECK_YOUR_CONNECTION,
  PLEASE_ENTER_OTP,
} from '../../utils/constant';
import { getNotificationToken } from '../../utils/firebase';
import { generateRandomString } from '../../utils/helper';
import { showToastWithGravity } from '../../utils/toastAndriod';
import CommonWrapper from '../CommonWrapper';

const SignUp = () => {
  const [isOtpVisible, setOtpVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignup, setSignup] = useState(false);
  const [isSignIn, setSignIn] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [notificationToken, setNotificationToken] = useState('');
  const [isUserUpdate, setUserUpdate] = useState(false);
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(false);

  let userLoginData = useAppSelector((state) => state.loginReducer.login);
  let loading = useAppSelector((state) => state.loginReducer.loading);
  const networkStatus = useAppSelector((state) => state.networkReducer.networkStatus);

  useEffect(() => {
    checkConnection();
    const getToken = async () => {
      const token = await getNotificationToken();
      setNotificationToken(token);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (userLoginData.message === INVALID_DEVICE_ID) {
      let password = generateRandomString(6);
      dispatch(
        actions.setSaveUserData({ name: 'password', value: password, form: 'saveUserData' }),
      );
      setUserUpdate(true);
    }
  }, [userLoginData.message]);

  useEffect(() => {
    if (isUserUpdate && networkStatus.isConnected && networkStatus.isInternetReachable) {
      dispatch(actions.updateUser({ data: userLoginData, callback: handleOnSuccess }));
      setUserUpdate(false);
    }
  }, [isUserUpdate]);

  useEffect(() => {
    if (isSignup) {
      dispatch(actions.SignUp({ data: userLoginData, callback: handleOnSuccess }));
      setSignup(false);
      setDisabledSubmitButton(false);
    }
  }, [isSignup]);

  useEffect(() => {
    if (isSignIn) {
      dispatch(actions.login({ data: userLoginData, callback: handleOnLoginSuccess }));
      setSignIn(false);
      setDisabledSubmitButton(false);
    }
  }, [isSignIn]);

  useEffect(() => {
    if (isLogin) {
      dispatch(actions.login({ data: userLoginData, callback: handleOnLoginSuccess }));
      setLogin(false);
      setDisabledSubmitButton(false);
    }
  }, [isLogin]);

  const checkConnection = () => {
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      return true;
    } else {
      showToastWithGravity(PLEASE_CHECK_YOUR_CONNECTION);
      return false;
    }
  };

  const onInit = () => {
    setFirstName('');
    setLastName('');
    dispatch(actions.resetSaveUserData());
  };

  const handleOnSuccess = () => {
    setOtpVisible(true);
  };

  const updateFirstName = (value: string) => {
    setFirstName(value);
  };

  const updateLastName = (value: string) => {
    setLastName(value);
  };

  const setSelectedValue = (value: string) => {
    dispatch(actions.setSaveUserData({ name: 'company', value: value, form: 'saveUserData' }));
  };

  const updatePassword = (value: string) => {
    dispatch(
      actions.setSaveUserData({ name: 'enteredPassword', value: value, form: 'saveUserData' }),
    );
  };

  const signUp = () => {
    if (!firstName.trim()) {
      showToastWithGravity(FIRSTNAME_REQUIRED);
      return false;
    } else if (!lastName.trim()) {
      showToastWithGravity(LASTNAME_REQUIRED);
      return false;
    } else {
      if (!checkConnection()) return false;
      setDisabledSubmitButton(true);
      const name = firstName.trim() + ' ' + lastName.trim();
      dispatch(actions.setSaveUserData({ name: 'name', value: name, form: 'saveUserData' }));

      let email = '';
      if (userLoginData.company === 'Genesis') {
        email =
          firstName.trim().toLowerCase() +
          '.' +
          lastName.trim().toLowerCase() +
          '@genesistechnologies.in';
      } else {
        email =
          firstName.trim().toLowerCase() + '.' + lastName.trim().toLowerCase() + '@snapsystems.in';
      }
      dispatch(actions.setSaveUserData({ name: 'email', value: email, form: 'saveUserData' }));

      let password = generateRandomString(6);
      dispatch(
        actions.setSaveUserData({ name: 'password', value: password, form: 'saveUserData' }),
      );
      dispatch(
        actions.setSaveUserData({
          name: 'notificationToken',
          value: notificationToken,
          form: 'saveUserData',
        }),
      );

      setSignup(true);
    }
  };

  const signIn = async () => {
    if (!firstName.trim()) {
      showToastWithGravity(FIRSTNAME_REQUIRED);
      return false;
    } else if (!lastName.trim()) {
      showToastWithGravity(LASTNAME_REQUIRED);
      return false;
    } else {
      if (!checkConnection()) return false;
      setDisabledSubmitButton(true);
      const name = firstName.trim() + ' ' + lastName.trim();
      dispatch(actions.setSaveUserData({ name: 'name', value: name, form: 'saveUserData' }));
      dispatch(actions.setSaveUserData({ name: 'password', value: '', form: 'saveUserData' }));
      dispatch(
        actions.setSaveUserData({
          name: 'notificationToken',
          value: notificationToken,
          form: 'saveUserData',
        }),
      );
      setSignIn(true);
    }
  };

  const login = () => {
    if (!firstName.trim()) {
      showToastWithGravity(FIRSTNAME_REQUIRED);
      return false;
    } else if (!lastName.trim()) {
      showToastWithGravity(LASTNAME_REQUIRED);
      return false;
    } else if (
      userLoginData.enteredPassword == undefined ||
      !userLoginData.enteredPassword.trim()
    ) {
      showToastWithGravity(PLEASE_ENTER_OTP);
      return false;
    } else {
      if (!checkConnection()) return false;
      setDisabledSubmitButton(true);
      const name = firstName.trim() + ' ' + lastName.trim();
      dispatch(actions.setSaveUserData({ name: 'name', value: name, form: 'saveUserData' }));
      dispatch(actions.setSaveUserData({ name: 'password', value: '', form: 'saveUserData' }));
      dispatch(
        actions.setSaveUserData({
          name: 'notificationToken',
          value: notificationToken,
          form: 'saveUserData',
        }),
      );
      setSignIn(true);
    }
  };

  const handleOnLoginSuccess = () => {};

  return (
    <Fragment>
      <CommonWrapper loading={loading} onInit={onInit} disableScrollView={false}>
        <View style={styles.container}>
          <View style={styles.logoSection}>
            <Image source={require('../../assets/Images/snaxgenie.png')} style={styles.logoImage} />
          </View>

          <TextInput
            style={styles.input}
            placeholder={FIRSTNAME}
            placeholderTextColor={globalStyles.placeholderText.color}
            value={firstName}
            onChangeText={(text) => updateFirstName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder={LASTNAME}
            placeholderTextColor={globalStyles.placeholderText.color}
            value={lastName}
            onChangeText={(text) => updateLastName(text)}
          />

          {isOtpVisible && (
            <TextInput
              style={styles.input}
              placeholder={OTP}
              placeholderTextColor={globalStyles.placeholderText.color}
              value={userLoginData.enteredPassword}
              onChangeText={(text) => updatePassword(text)}
              secureTextEntry
            />
          )}
          {!isOtpVisible && (
            <View style={styles.radioContainer}>
              <RadioButton.Group
                onValueChange={(value) => setSelectedValue(value)}
                value={userLoginData.company}
              >
                <View style={[styles.radioOption, { marginBottom: 5 }]}>
                  <RadioButton value="Genesis" color={globalStyles.primary.color} />
                  <Text style={globalStyles.placeholderText}>Genesis</Text>
                </View>
                <View style={[styles.radioOption, { marginBottom: 20 }]}>
                  <RadioButton value="Snap System" color={globalStyles.primary.color} />
                  <Text style={globalStyles.placeholderText}>Snap System</Text>
                </View>
              </RadioButton.Group>
            </View>
          )}
          <View style={styles.buttonContainer}>
            {!isOtpVisible && (
              <TouchableHighlight
                style={[styles.button]}
                underlayColor={globalStyles.primary.color}
                onPress={signUp}
                disabled={disabledSubmitButton}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableHighlight>
            )}
            <View style={styles.buttonSeparator} />
            {!isOtpVisible && (
              <TouchableHighlight
                style={[styles.button]}
                underlayColor={globalStyles.primary.color}
                onPress={signIn}
                disabled={disabledSubmitButton}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableHighlight>
            )}

            {isOtpVisible && (
              <TouchableHighlight
                style={[styles.button, { backgroundColor: globalStyles.primary.color }]}
                underlayColor={globalStyles.primary.color}
                onPress={login}
                disabled={disabledSubmitButton}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </CommonWrapper>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: '#94bf3c61',
    cursor: 'pointer',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center,',
  },
  buttonSeparator: {
    height: 20,
  },
  logoSection: {
    width: 300,
  },
  logoImage: {
    marginBottom: 30,
    width: '100%',
    height: 100,
  },
  btn: {},
  formSection: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: globalStyles.primary.color,
  },
  textInput: {
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 2,
    marginBottom: 20,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 150,
    backgroundColor: globalStyles.secondary.color,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: globalStyles.placeholderText.color,
    color: globalStyles.dark.color,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    backgroundColor: globalStyles.primary.color,
  },
  buttonText: {
    color: globalStyles.secondary.color,
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SignUp;
