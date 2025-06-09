import { Dimensions, StyleSheet } from 'react-native';

let ScreenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  logoImage: {
    transform: [{ scale: 1 }],
  },
  sectionContainer: {
    paddingHorizontal: 0,
    flex: 1,
    alignItems: 'center',
    height: ScreenHeight,
  },
});
