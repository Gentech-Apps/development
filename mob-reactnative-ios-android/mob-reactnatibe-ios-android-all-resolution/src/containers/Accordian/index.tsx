import React, { Fragment, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from '../../globalStyles';
import { menus } from '../../redux/foodMenu/foodMenuRootState';
import { actions } from '../../redux/foodMenu/foodMenuSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  CORRECT_QUANTITY,
  FEEDBACK,
  MAXIMUM_QUANTITY,
  MINIMUM_QUANTITY,
  ORDER_ACCEPT_WINDOW,
  ORDER_SUCCESSFULLY,
  PLEASE_CHECK_YOUR_CONNECTION,
  PLEASE_ENTER_VALID_QUANTITY,
  QUANTITY,
} from '../../utils/constant';
import { trimString } from '../../utils/helper';
import { showToastWithGravity } from '../../utils/toastAndriod';
import FeedbackModal from '../FeedbackModal';
import OrderModal from './OrderModel';

let { width, height } = Dimensions.get('window');
const padding = (height * 70) / 100;

type AccordianProps = {
  title?: string;
  content?: string;
  foodList?: menus[];
  onInit?: () => void;
};

const Accordion = ({ title, content, foodList = [], onInit }: AccordianProps) => {
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(false);

  let { userId, deviceId } = useAppSelector((state) => state.loginReducer.login);
  let saveOrderData = useAppSelector((state) => state.foodMenuReducer.saveOrder);
  let serverDateTime = useAppSelector((state) => state.foodMenuReducer.serverDateTime);
  const networkStatus = useAppSelector((state) => state.networkReducer.networkStatus);

  useEffect(() => {
    dispatch(actions.getServerDateTime());
    dispatch(actions.getAllMenusViaCategory());
  }, []);

  useEffect(() => {
    if (modalVisible) {
      setDisabledSubmitButton(false);
    }
  }, [modalVisible]);

  const toggleAccordion = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5000],
  });

  const handleClick = async (item: menus) => {
    // console.log('serverDateTime: ', serverDateTime);

    // Need to check that order is diabled or not
    if (!serverDateTime) {
      showToastWithGravity(ORDER_ACCEPT_WINDOW);
      return;
    }
    setModalData(item);
    dispatch(actions.setSaveOrderData({ name: 'itemId', value: item.id, form: 'saveOrder' }));
    dispatch(actions.setSaveOrderData({ name: 'userId', value: userId, form: 'saveOrder' }));
    dispatch(actions.setSaveOrderData({ name: 'deviceId', value: deviceId, form: 'saveOrder' }));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalData(null);
    updateQuantity(1);
    setQuantity('1');
  };

  const saveOrderSuccess = () => {
    showToastWithGravity(ORDER_SUCCESSFULLY);
    setModalVisible(false);
    setModalData(null);
    updateQuantity(1);
    setDisabledSubmitButton(false);
  };

  const orderContinue = () => {
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      if (!setQuantityValue(quantity)) return;
      setDisabledSubmitButton(true);
      dispatch(
        actions.saveOrder({
          data: { ...saveOrderData, quantity: Number(quantity) },
          callback: saveOrderSuccess,
        }),
      );
      setModalVisible(false);
      updateQuantity(1);
      setQuantity('1');
    } else {
      showToastWithGravity(PLEASE_CHECK_YOUR_CONNECTION);
    }
  };

  const updateQuantity = (value: number) => {
    dispatch(actions.setSaveOrderData({ name: 'quantity', value: value, form: 'saveOrder' }));
  };

  const setQuantityValue = (valueText: string) => {
    const parsedQty = Number(valueText);
    if (!Number.isInteger(parsedQty)) {
      showToastWithGravity(PLEASE_ENTER_VALID_QUANTITY);
    } else if (Number.isNaN(parsedQty)) {
      showToastWithGravity(CORRECT_QUANTITY);
    } else if (parsedQty < 1) {
      showToastWithGravity(MINIMUM_QUANTITY);
    } else if (parsedQty > 10) {
      showToastWithGravity(MAXIMUM_QUANTITY);
    } else {
      updateQuantity(parsedQty);
      return true;
    }
    return false;
  };

  const openFeedbackPopup = (itemId: number) => {
    dispatch(actions.setFeedbackData({ name: 'itemId', value: itemId, form: 'saveFeedback' }));
    dispatch(actions.setFeedbackData({ name: 'userId', value: userId, form: 'saveFeedback' }));
    setFeedbackModalVisible(true);
  };

  const closefeedbackModal = () => {
    dispatch(actions.resetFeedbackData());
    setFeedbackModalVisible(false);
  };

  return (
    <Fragment>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View
          style={[
            width !== 360 && styles.headerContainer,
            width === 360 && styles.with360headerContainer,
          ]}
        >
          <Text
            style={[styles.headerText, globalStyles.font_18, width === 360 && globalStyles.font_16]}
          >
            {trimString(title)}
          </Text>
          <Animated.Text style={[styles.arrowIcon, { transform: [{ rotate: rotateArrow }] }]}>
            &#9662;
          </Animated.Text>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.animatedViewContainer, { maxHeight: contentHeight }]}>
        {foodList.length ? (
          <View style={[styles.contentContainer, width === 360 && styles.with360contentContainer]}>
            {foodList.map((item, index) => (
              <View key={item?.id}>
                <TouchableWithoutFeedback onPress={() => handleClick(item)}>
                  <View
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={[
                        { flex: 7, color: globalStyles.primaryText.color },
                        width !== 360 && globalStyles.font_16,
                        width === 360 && styles.with360Font,
                      ]}
                    >
                      {trimString(item.itemName)}
                    </Text>
                    {item?.item === 'active' ? (
                      <TouchableOpacity
                        onPress={() => openFeedbackPopup(item?.id)}
                        style={styles.feedbackIconContainer}
                        activeOpacity={0.7}
                      >
                        <Text>
                          <Icon
                            style={[
                              styles.feedbackIcon,
                              width !== 360 && globalStyles.font_24,
                              width === 360 && globalStyles.font_20,
                            ]}
                            name="thumb-up-off-alt"
                            color={'grey'}
                          />{' '}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    <Text
                      style={
                        item.item === 'active'
                          ? [styles.activePriceText, globalStyles.font_16]
                          : [styles.inActivePriceText, globalStyles.font_16]
                      }
                    >
                      {'₹' + item?.itemPrice}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ))}
          </View>
        ) : null}
      </Animated.View>

      <OrderModal isVisible={modalVisible} closeModal={closeModal}>
        <View>
          <Text style={styles.modelHeading}>Food Order</Text>
        </View>
        <View style={styles.modalTopContent}>
          <TextInput
            editable={false}
            multiline={true}
            numberOfLines={3}
            style={styles.input}
            value={trimString(modalData?.itemName)}
          />
          <TextInput
            style={styles.input}
            placeholder={QUANTITY}
            placeholderTextColor={globalStyles.placeholderText.color}
            value={quantity}
            keyboardType="numeric"
            onChangeText={(text) => setQuantity(text)}
          />
        </View>
        <View style={styles.modalBottomSec}>
          <TouchableHighlight
            style={[styles.popupButton, saveOrderData.quantity <= 0 && styles.disabledButton]}
            underlayColor={globalStyles.primary.color}
            onPress={() => orderContinue()}
            disabled={disabledSubmitButton}
          >
            <Text style={styles.buttonText}>Order</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.popupButton, { backgroundColor: globalStyles.negative.color }]}
            underlayColor={globalStyles.negative.color}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </OrderModal>

      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={closefeedbackModal as any}
        modalText={FEEDBACK}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
  img: {
    width: '100%',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    borderRadius: 10,
    margin: 2,
    flexDirection: 'row',
    width: '48%',
    backgroundColor: globalStyles.primary.color,
  },
  disabledButton: {
    backgroundColor: globalStyles.primaryLightShade.color,
  },
  modalPopup: {
    borderRadius: 10,
    elevation: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    padding: 20,
    marginTop: padding,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: globalStyles.primary.color,
    width: Platform.OS === 'ios' ? width - 10 : width,
  },
  with360headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: globalStyles.primary.color,
    color: globalStyles.secondary.color,
    width: Platform.OS === 'ios' ? width - 10 : width,
  },
  headerText: {
    fontWeight: '500',
    ...globalStyles.secondary,
  },
  arrowIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    ...globalStyles.secondary,
    transform: [{ rotate: '0deg' }],
  },
  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: globalStyles.primaryLightShade.color,
  },
  with360contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: globalStyles.primaryLightShade.color, //'#f5f5f5',
  },
  contentText: {
    fontSize: 16,
  },
  modelHeading: {
    color: '#0F0F0F',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTopContent: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  modalBottomSec: { position: 'relative', flex: 1, flexDirection: 'row', alignItems: 'flex-end' },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
    backgroundColor: globalStyles.primary.color,
  },
  buttonText: {
    color: globalStyles.secondary.color,
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  input: {
    height: 60,
    borderBottomColor: globalStyles.placeholderText.color,
    color: globalStyles.dark.color,
    borderBottomWidth: 0.5,
    width: '100%',
    fontSize: 16,
  },
  with360: {
    paddingHorizontal: 15,
  },
  with360Font: {
    fontSize: 14,
  },
  animatedViewContainer: {
    overflow: 'hidden',
  },
  touchableItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackIconContainer: { flex: 2, backgroundColor: 'transparent', zIndex: 999999 },
  feedbackIcon: { color: 'orange', fontWeight: 'normal' },
  activePriceText: { flex: 1, color: globalStyles.primaryText.color },
  inActivePriceText: { flex: 1, left: 10, color: globalStyles.primaryText.color },
  touchableItem: {
    flex: 7,
    color: globalStyles.primaryText.color,
    fontSize: width === 360 ? 14 : globalStyles.font_16.fontSize,
  },
});

export default Accordion;
