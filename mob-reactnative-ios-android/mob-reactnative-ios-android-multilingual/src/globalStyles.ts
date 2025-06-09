import { Dimensions, StyleSheet } from 'react-native';
let { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
  //Color
  primary: { color: '#94bf3c' },
  primaryLightShade: { color: '#E8F3CD' },
  secondary: { color: '#ffffff' },
  warning: { color: 'yellow' },
  negative: { color: '#F44336' },
  dark: { color: '#0F0F0F' },
  //Text
  primaryText: { color: '#0F0F0F' },
  secondaryText: { color: '#6a6a71' },
  //Borders
  border: {
    borderRadius: 10,
  },
  //Font Size
  font_24: {
    fontSize: 24,
  },
  font_20: {
    fontSize: 20,
  },
  font_18: {
    fontSize: 18,
  },
  font_16: {
    fontSize: 16,
  },
  font_14: {
    fontSize: 14,
  },
  //Navigation
  //Navigation
  bottomTabDefault: {
    backgroundColor: '#ffffff',
    color: '#0F0F0F',
  },
  bottomTabActive: {
    backgroundColor: '#ffffff',
    color: '#94bf3c',
  },
  bottomTabIconColor: { color: '#d5d4e3' },
  //Buttons
  btnUnderlayColor: { color: '#9fc651' },
  btnNegativeUnderlayColor: { color: '#F44336' },
  btnFullWidth: {
    marginTop: 15,
    width: 360,
    height: 55,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 10,
  },
  btnHalfWidth: {
    height: height > 1100 ? 60 : 50,
    width: width > 600 ? 190 : 140,
    elevation: 4,
    borderRadius: 10,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: width > 600 ? 26 : 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
    textTransform: 'uppercase',
  },
  //Inputs
  inputField: {
    marginTop: 15,
    width: '95%',
    height: 60,
    fontSize: 18,
    color: '#0F0F0F',
  },
  inputFieldDefaultColor: {
    backgroundColor: '#f3f7e9',
  },
  inputFieldFocusColor: {
    backgroundColor: '#e7f0d3',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: height,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  highlight: {
    fontSize: 30,
    fontWeight: '700',
  },
  //Network
  NetworkContainer: {
    justifyContent: 'center',
  },
  NetworkText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'normal',
    margin: 2,
  },
  NetworkIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  //Loader
  loaderWithTextStyle: { marginTop: 2, textAlign: 'center', fontSize: 20, color: '#6d7275' },
});

export const lightThemeStyles = StyleSheet.create({
  //Color
  primary: { color: '#94bf3c' },
  primaryLightShade: { color: '#E8F3CD' },
  primaryTouchShade: { color: '#E8F3CD' },
  secondary: { color: '#ffffff' },
  warning: { color: 'yellow' },
  negative: { color: '#F44336' },
  dark: { color: '#0F0F0F' },
  //Text
  primaryText: { color: '#0F0F0F' },
  secondaryText: { color: '#6a6a71' },
  //Borders
  border: {
    borderRadius: 10,
  },
  //Navigation
  bottomTabDefault: {
    backgroundColor: globalStyles.secondary.color,
    color: globalStyles.dark.color,
  },
  bottomTabActive: {
    backgroundColor: globalStyles.secondary.color,
    color: globalStyles.primary.color,
  },
  bottomTabIconColor: { color: '#d5d4e3' },
  //Buttons
  btnUnderlayColor: { color: '#9fc651' },
  btnNegativeUnderlayColor: { color: '#F44336' },
  btnFullWidth: {
    marginTop: 15,
    width: 360,
    height: 55,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 10,
  },
  btnHalfWidth: {
    height: 50,
    width: 140,
    elevation: 4,
    borderRadius: 10,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
    textTransform: 'uppercase',
  },

  container: {
    backgroundColor: globalStyles.secondary.color,
    color: globalStyles.dark.color,
  },
  elevationItem: {
    margin: 1,
    backgroundColor: globalStyles.primaryLightShade.color,
    borderRadius: globalStyles.border.borderRadius,
  },
  elevationItemWeekly: {
    margin: 10,
    backgroundColor: globalStyles.primaryLightShade.color,
    borderRadius: globalStyles.border.borderRadius,
  },
  borderBottomColor: {
    borderBottomColor: '#191919',
  },
  containerStyle: {
    backgroundColor: globalStyles.secondary.color,
  },
  groceryModeBackgroundColor: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  groceryModelTextColor: {
    color: '#8f8d8d',
  },
  borderBottomWidth: {
    borderBottomColor: '#a3a3a3',
    borderBottomWidth: 0,
  },
  //Inputs
  inputField: {
    marginTop: 15,
    width: '95%',
    height: 60,
    fontSize: 18,
    color: '#0F0F0F',
  },
  inputFieldDefaultColor: {
    backgroundColor: '#f3f7e9',
    color: globalStyles.primaryText.color,
  },
  inputFieldFocusColor: {
    backgroundColor: '#e7f0d3',
    color: globalStyles.primaryText.color,
  },
  //Loader
  loaderWithTextStyle: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 20,
    color: globalStyles.primaryText.color,
  },
});

export const darkThemeStyles = StyleSheet.create({
  //Color
  primary: { color: '#94bf3c' },
  primaryLightShade: { color: '#33362d' },
  primaryTouchShade: { color: '#2f4503' },
  secondary: { color: '#ffffff' },
  warning: { color: 'yellow' },
  negative: { color: '#F44336' },
  dark: { color: '#0F0F0F' },
  //Text
  primaryText: { color: '#ffffff' },
  secondaryText: { color: '#6a6a71' },
  //Borders
  border: {
    borderRadius: 10,
  },
  //Navigation
  bottomTabDefault: {
    backgroundColor: '#1e2118', //121212
    color: globalStyles.secondary.color,
  },
  bottomTabActive: {
    backgroundColor: '#1e2118', //121212
    color: globalStyles.primary.color,
  },
  bottomTabIconColor: { color: '#d5d4e3' },
  //Buttons
  btnUnderlayColor: { color: '#9fc651' },
  btnNegativeUnderlayColor: { color: '#F44336' },
  btnFullWidth: {
    marginTop: 15,
    width: 360,
    height: 55,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 10,
  },
  btnHalfWidth: {
    height: 50,
    width: 140,
    elevation: 4,
    borderRadius: 10,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'white',
    textTransform: 'uppercase',
  },

  container: {
    backgroundColor: globalStyles.dark.color,
    color: globalStyles.secondary.color,
  },
  elevationItem: {
    margin: 1,
    backgroundColor: '#2C3912',
    borderRadius: globalStyles.border.borderRadius,
  },
  elevationItemWeekly: {
    margin: 10,
    backgroundColor: '#2C3912',
    borderRadius: globalStyles.border.borderRadius,
  },
  borderBottomColor: {
    borderBottomColor: globalStyles.secondary.color,
  },
  containerStyle: {
    backgroundColor: '#191919',
  },
  groceryModeBackgroundColor: {
    backgroundColor: 'rgba(51, 54, 45, 0.5)', //'rgba(255, 255, 255, 0.5)',
  },
  groceryModelTextColor: {
    color: '#919191',
  },
  borderBottomWidth: {
    borderBottomColor: globalStyles.secondary.color,
    borderBottomWidth: 0,
  },
  //Inputs
  inputField: {
    marginTop: 15,
    width: '95%',
    height: 60,
    fontSize: 18,
    color: '#ffffff',
  },
  inputFieldDefaultColor: {
    backgroundColor: '#33362d',
    color: globalStyles.secondary.color,
  },
  inputFieldFocusColor: {
    backgroundColor: '#333628',
    color: globalStyles.secondary.color,
  },
  //Loader
  loaderWithTextStyle: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 20,
    color: globalStyles.secondary.color,
  },
});
