import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import CommonModal from '../../components/ModalWrapper';
import StarRating from '../../components/StarRating';
import { globalStyles } from '../../globalStyles';
import { actions } from '../../redux/foodMenu/foodMenuSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { COMMENT_REQUIRED, NO_INTERNET_CONNECTION, RATING_REQUIRED } from '../../utils/constant';
import { PLEASE_CHECK_YOUR_CONNECTION } from '../../utils/constant';
import { trimString } from '../../utils/helper';
import { showToastWithGravity } from '../../utils/toastAndriod';

type FeedbackProps = {
  visible: boolean;
  onClose: () => {};
  modalText?: string;
};

const FeedbackModal = ({ visible, onClose, modalText }: FeedbackProps) => {
  const dispatch = useAppDispatch();

  const feedbackData = useAppSelector((state) => state.foodMenuReducer.saveFeedback);
  const networkStatus = useAppSelector((state) => state.networkReducer.networkStatus);
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(false);

  const handleRatingChange = (newRating: number) => {
    dispatch(actions.setFeedbackData({ name: 'rating', value: newRating, form: 'saveFeedback' }));
  };

  const updateComment = (value: string) => {
    dispatch(actions.setFeedbackData({ name: 'comment', value: value, form: 'saveFeedback' }));
  };

  const submitFeedback = () => {
    if (feedbackData.rating === 0) {
      showToastWithGravity(RATING_REQUIRED);
    } else if (feedbackData.rating <= 2 && feedbackData.comment?.trim() === '') {
      showToastWithGravity(COMMENT_REQUIRED);
    } else {
      if (networkStatus.isConnected && networkStatus.isInternetReachable) {
        setDisabledSubmitButton(true);
        dispatch(
          actions.saveFeedback({
            data: { comment: feedbackData.comment?.trim(), ...feedbackData },
            callback: successOnFeedback,
          }),
        );
      } else {
        showToastWithGravity(PLEASE_CHECK_YOUR_CONNECTION);
      }
    }
  };

  const successOnFeedback = () => {
    onClose();
    setDisabledSubmitButton(false);
  };

  const disableButton = () => {
    if (disabledSubmitButton || (feedbackData.rating <= 2 && feedbackData.comment?.trim() === '')) {
      return true;
    }
    return false;
  };

  return (
    <CommonModal isVisible={visible} closeModal={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.modalTitle}>{trimString(modalText)}</Text>
        </View>
        <StarRating rating={feedbackData.rating} onRatingChange={handleRatingChange} />
        {feedbackData?.rating != 0 && (
          <TextInput
            style={styles.input}
            placeholder={feedbackData.rating <= 2 ? 'Comment*' : 'Comment (Optional)'}
            placeholderTextColor={globalStyles.placeholderText.color}
            value={feedbackData.comment}
            onChangeText={(text) => updateComment(text)}
          />
        )}
      </View>
      <View style={styles.modalContentSection}>
        <TouchableHighlight
          style={[styles.popupButton, disableButton() ? styles.disabledButton : {}]}
          underlayColor={globalStyles.primary.color}
          onPress={() => submitFeedback()}
          disabled={disableButton()}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.popupButton, { backgroundColor: globalStyles.negative.color }]}
          underlayColor={globalStyles.negative.color}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableHighlight>
      </View>
    </CommonModal>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 60,
    borderBottomColor: globalStyles.placeholderText.color,
    borderBottomWidth: 0.5,
    width: '100%',
    ...globalStyles.font_18,
    color: globalStyles.dark.color,
  },
  modalTitle: {
    textAlign: 'center',
    color: globalStyles.primaryText.color,
    fontWeight: 'bold',
    fontSize: globalStyles.font_24.fontSize,
  },
  disabledButton: {
    backgroundColor: globalStyles.primaryLightBtnShade.color,
  },
  modalPopup: {
    borderRadius: 10,
    backgroundColor: globalStyles.secondary.color,
    elevation: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 20,
    marginTop: 230,
    marginBottom: 230,
    marginLeft: 10,
    marginRight: 10,
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
    fontWeight: '400',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: globalStyles.font_20.fontSize,
  },
  modalContainer: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  textContainer: { flexDirection: 'column', alignItems: 'center', width: '100%' },
  modalContentSection: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default FeedbackModal;
