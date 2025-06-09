import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { logout } from '../../containers/Login/redux/slice';
import { globalStyles } from '../../globalStyles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { AMOUNT_HI } from '../../utils/constants';

export const HeaderLeft = () => {
  const dispatch = useAppDispatch();

  return (
    <Pressable
    // onPress={() => dispatch(logout())}
    >
      <Image
        style={{ width: 45, height: 45, marginLeft: 10 }}
        source={require('../../assets/images/ic_icon_round.png')}
      />
    </Pressable>
  );
};

export const HeaderRight = () => {
  const { totalDebit } = useAppSelector((state) => state.transaction);

  return (
    <View style={{ marginRight: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: globalStyles.secondary.color }}>
        {AMOUNT_HI} ({totalDebit})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
