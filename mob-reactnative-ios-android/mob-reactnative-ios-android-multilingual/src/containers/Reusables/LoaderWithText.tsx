import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../../ThemeProvider';
import { globalStyles } from '../../globalStyles';
import { trimString } from '../../utils/helpers/utils';

const LoaderWithText = ({ text }) => {
  const { theme }: any = useTheme();
  return (
    <View style={[theme.container, globalStyles.container]}>
      <ActivityIndicator size={50} color={theme.primary.color} />
      <Text style={theme.loaderWithTextStyle}>{trimString(text)}</Text>
    </View>
  );
};

export default LoaderWithText;
