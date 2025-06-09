import { Dimensions, StyleSheet } from 'react-native';
let ScreenHeight = Dimensions.get('window').height;

export const globalStyles = StyleSheet.create({
  //Color
  primary: { color: '#94bf3c' },
  primaryDarkShade: { color: '#769830' },
  primaryLightShade: { color: '#E8F3CD' },
  primaryLightBtnShade: { color: '#94bf3cb0' },
  secondary: { color: '#ffffff' },
  warning: { color: 'yellow' },
  negative: { color: '#F44336' },
  dark: { color: '#0F0F0F' },
  //Text
  primaryText: { color: '#0F0F0F' },
  secondaryText: { color: '#6a6a71' },
  placeholderText: {
    color: '#888490',
  },
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
  //Elevations
  elevationItemWeekly: {
    margin: 10,
    backgroundColor: '#E8F3CD',
    borderRadius: 10,
  },
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
    height: ScreenHeight,
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
