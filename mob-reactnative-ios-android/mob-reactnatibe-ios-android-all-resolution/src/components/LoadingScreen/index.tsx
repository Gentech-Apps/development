import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { globalStyles } from '../../globalStyles';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={100}
        color={globalStyles.primary.color}
        style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export default LoadingScreen;
