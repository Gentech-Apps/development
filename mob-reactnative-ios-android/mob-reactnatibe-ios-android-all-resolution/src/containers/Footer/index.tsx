import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../globalStyles';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Text>Snaxgenie@2023</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: { backgroundColor: globalStyles.secondary.color },
});

export default Footer;
