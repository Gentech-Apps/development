import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import DropdownComponent from '../../components/Dropdown';
import CommonModal from '../../components/ModalWrapper';
import { globalStyles } from '../../globalStyles';
import { actions, actions as weeklyActions } from '../../redux/weeklyMenu/weeklyMenuSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getState } from '../../utils/asyncStorage';
import { PLEASE_CHECK_YOUR_CONNECTION } from '../../utils/constant';
import { ADD_SUGGESTION, ORDER_STATUS, TRANSACTION } from '../../utils/constant';
import { showToastWithGravity } from '../../utils/toastAndriod';
import CommonWrapper from '../CommonWrapper';
import WeeklyMenuAccordian from './WeeklyMenuAccordian';
const { width } = Dimensions.get('window');

const WeeklyMenu = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { notificationNavigate, networkStatus } = useAppSelector((state) => state.networkReducer);
  const [modalVisible, setModalVisible] = useState(false);
  const weeklyMenuData = useAppSelector((state) => state.weeklyMenuReducer.weeklyMenuData);
  const filteredData = weeklyMenuData.filter(
    (item) => item.subType !== null && item.subType[0] !== null,
  );
  const loading = useAppSelector((state) => state.weeklyMenuReducer.loading);
  const suggestionReq = useAppSelector((state) => state.weeklyMenuReducer.suggestionRequest);
  const { userId } = useAppSelector((state) => state.loginReducer.login);
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(false);

  useEffect(() => {
    if (notificationNavigate === ORDER_STATUS) {
      navigation.navigate(ORDER_STATUS);
    }
    if (notificationNavigate === TRANSACTION) {
      navigation.navigate(TRANSACTION);
    }
  }, [suggestionReq.categoryId, notificationNavigate]);

  useFocusEffect(
    useCallback(() => {
      onInit();
    }, []),
  );

  const setDataToState = async () => {
    const data = await getState('WeeklyMenu');
    if (data) {
      dispatch(actions.updateAllWeeklyMenu(JSON.parse(data)));
    }
  };

  const onInit = async () => {
    NetInfo.fetch()
      .then((state) => {
        if (state.isConnected && state.isInternetReachable) {
          dispatch(actions.getAllWeeklyMenu());
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

  const menuSuggestion = () => {
    dispatch(
      weeklyActions.updateSuggestionRequest({
        name: 'userId',
        value: userId,
        form: 'saveSuggestionReq',
      }),
    );
    setModalVisible(true);
  };
  const closeModal = () => {
    dispatch(weeklyActions.clearSuggestionRequest());
    setModalVisible(false);
  };

  const submitSuggestion = () => {
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      setDisabledSubmitButton(true);
      dispatch(actions.addSuggestion({ data: suggestionReq, callback: handleOnSuccess }));
    } else {
      showToastWithGravity(PLEASE_CHECK_YOUR_CONNECTION);
    }
  };

  const handleOnSuccess = () => {
    closeModal();
    setDisabledSubmitButton(false);
  };

  const updateSuggestion = (text: string) => {
    dispatch(
      weeklyActions.updateSuggestionRequest({
        name: 'suggestion',
        value: text,
        form: 'saveSuggestionReq',
      }),
    );
  };

  return (
    <Fragment>
      <CommonWrapper loading={loading} onInit={onInit} disableScrollView={false} viewHeight={true}>
        <View style={[styles.weekMenuSec]}>
          {filteredData?.length > 0
            ? filteredData?.map((item, index) => {
                return <WeeklyMenuAccordian key={item.dayId} item={item as any} />;
              })
            : null}
        </View>
      </CommonWrapper>

      <View style={styles.menuSuggestionContainer}>
        <TouchableHighlight
          style={styles.menuSuggestionButton}
          underlayColor="#565657"
          onPress={menuSuggestion}
        >
          <Text style={styles.buttonText}>Menu Suggestion</Text>
        </TouchableHighlight>
      </View>
      <CommonModal isVisible={modalVisible} closeModal={closeModal}>
        <View>
          <Text style={styles.modelHeading}>Menu Suggestion</Text>
        </View>
        <View style={styles.modalTopContent}>
          <DropdownComponent />
          <TextInput
            style={styles.input}
            placeholder={ADD_SUGGESTION}
            placeholderTextColor={globalStyles.placeholderText.color}
            value={suggestionReq.suggestion}
            onChangeText={(text) => updateSuggestion(text)}
          />
        </View>
        <View style={styles.modalBottomSec}>
          <TouchableHighlight
            style={[
              styles.popupButton,
              suggestionReq.categoryId === 0 && styles.disabledButton,
              !suggestionReq.suggestion && styles.disabledButton,
            ]}
            underlayColor={globalStyles.primary.color}
            onPress={() => submitSuggestion()}
            disabled={
              disabledSubmitButton || suggestionReq.categoryId === 0 || !suggestionReq.suggestion
            }
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.popupButton, { backgroundColor: globalStyles.negative.color }]}
            underlayColor={globalStyles.negative.color}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </CommonModal>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  textContent: {
    ...globalStyles.primaryText,
    ...globalStyles.font_16,
    paddingBottom: 5,
  },
  mainContent: {},
  bannerSection: {},
  modalBottomSec: { position: 'relative', flex: 1, flexDirection: 'row', alignItems: 'flex-end' },
  disabledButton: { backgroundColor: globalStyles.primaryLightBtnShade.color, cursor: 'pointer' },
  modalTopContent: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
    backgroundColor: globalStyles.primary.color,
  },
  buttonText: {
    color: globalStyles.secondary.color,
    fontSize: width === 360 ? 18 : 20,
    fontWeight: '400',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  bannerImage: { height: 200 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: globalStyles.primary.color,
    color: globalStyles.secondary.color,
    width: 405,
  },
  headerText: { fontSize: 18, fontWeight: 'bold', ...globalStyles.secondary },
  headerTextVal: { color: globalStyles.placeholderText.color },
  label: { width: '20%', minWidth: '20%', color: globalStyles.primary.color },
  input: {
    height: 60,
    borderBottomColor: globalStyles.placeholderText.color,
    borderBottomWidth: 0.5,
    width: '100%',
    fontSize: 16,
    color: globalStyles.dark.color,
  },
  weekMenuSec: {
    // marginVertical: 2,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    ...globalStyles.secondary,
    transform: [{ rotate: '0deg' }],
  },
  contentContainer: {
    padding: 10,
    backgroundColor: globalStyles.primaryLightShade.color, //'#f5f5f5',
  },
  modelHeading: {
    color: globalStyles.dark.color,
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuSuggestionContainer: { marginHorizontal: 5 },
  menuSuggestionButton: {
    backgroundColor: globalStyles.secondaryText.color,
    paddingVertical: width !== 360 ? 20 : 10,
  },
});

export default WeeklyMenu;
