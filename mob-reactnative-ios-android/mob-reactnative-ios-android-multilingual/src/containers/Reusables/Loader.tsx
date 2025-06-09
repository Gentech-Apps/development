import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../ThemeProvider';
import { globalStyles } from '../../globalStyles';

const Loader = () => {
  const { theme }: any = useTheme();
  return (
    <View style={[theme.container, globalStyles.container]}>
      <ActivityIndicator size={50} color={globalStyles.primary.color} />
    </View>
  );
};

export default Loader;
