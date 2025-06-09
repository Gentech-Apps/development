import React, { Fragment } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { globalStyles } from '../../globalStyles';

interface CommonModalProps {
  isVisible: boolean;
  closeModal: () => void;
  children: any;
}

const OrderModal: React.FC<CommonModalProps> = ({ isVisible, closeModal, children }) => {
  return (
    <Fragment>
      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={() => console.log('no warning')}
        style={styles.modelContainer}
        transparent
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ height: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <View style={styles.modalPopup}>{children}</View>
        </ScrollView>
      </Modal>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  modelContainer: {
    justifyContent: 'flex-end',
    margin: 0,
    zIndex: 999,
    shadowOpacity: 20,
    opacity: 2,
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
    // padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 0,
    marginTop: 250,
    // marginBottom: 300,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default OrderModal;
