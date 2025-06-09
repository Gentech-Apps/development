import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { globalStyles } from '../../../globalStyles';
import { actions } from '../../../redux/login/loginSlice';
import { useAppDispatch } from '../../../store/hooks';
import { removeState } from '../../../utils/asyncStorage';

const SignOut = () => {
  const dispatch = useAppDispatch();

  const signOut = () => {
    removeState();
    dispatch(actions.resetSaveUserData());
  };
  return (
    <View>
      <TouchableHighlight
        underlayColor={globalStyles.primary.color}
        // onPress={() => {
        //   signOut();
        // }}
      >
        <Image
          source={require('../../../assets/Images/icon_round.png')}
          style={styles.logoutIcon}
        />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutIcon: {
    marginLeft: 10,
    height: 45,
    width: 45,
  },
});

export default SignOut;
