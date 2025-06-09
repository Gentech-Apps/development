import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { actions } from '../../redux/foodMenu/foodMenuSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getState } from '../../utils/asyncStorage';
import { ORDER_STATUS, TRANSACTION } from '../../utils/constant';
import { PLEASE_CHECK_YOUR_CONNECTION } from '../../utils/constant';
import { showToastWithGravity } from '../../utils/toastAndriod';
import Accordion from '../Accordian';
import CommonWrapper from '../CommonWrapper';

const FoodMenu = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { notificationNavigate, networkStatus } = useAppSelector((state) => state.networkReducer);
  let loginSuccessData = useAppSelector((state) => state.loginReducer.login);
  let loading = useAppSelector((state) => state.foodMenuReducer.loading);
  let { foodMenuCatData } = useAppSelector((state) => state.foodMenuReducer);

  const setDataToState = async () => {
    const data = await getState('FoodMenu');
    dispatch(actions.updateAllMenusViaCategory(JSON.parse(data)));
  };

  const onInit = () => {
    NetInfo.fetch()
      .then((state) => {
        if (state?.isConnected && state?.isInternetReachable) {
          dispatch(actions.getAllMenusViaCategory());
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

  useEffect(() => {
    if (notificationNavigate === ORDER_STATUS) {
      navigation.navigate(ORDER_STATUS);
    }
    if (notificationNavigate === TRANSACTION) {
      navigation.navigate(TRANSACTION);
    }
  }, [notificationNavigate]);

  useFocusEffect(
    useCallback(() => {
      onInit();
    }, [loginSuccessData]),
  );

  return (
    <Fragment>
      <CommonWrapper loading={loading} onInit={onInit} disableScrollView={false}>
        <View style={styles.foodSection}>
          {foodMenuCatData?.map((category, index) =>
            category?.foodList?.length > 0 ? (
              <View key={index} style={styles.view}>
                <Accordion
                  key={category?.categoryId}
                  title={category?.categoryName}
                  foodList={category?.foodList}
                  onInit={onInit}
                />
              </View>
            ) : null,
          )}
        </View>
      </CommonWrapper>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  foodSection: {
    marginVertical: 3,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: { height: 200 },
  view: { padding: 2 },
});

export default FoodMenu;
