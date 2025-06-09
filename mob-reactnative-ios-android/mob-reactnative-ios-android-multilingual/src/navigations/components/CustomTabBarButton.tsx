import { Dimensions, TouchableHighlight } from 'react-native';
import { useTheme } from '../../ThemeProvider';
import { globalStyles } from '../../globalStyles';

const { height } = Dimensions.get('window');

const CustomTabBarButton = ({ accessibilityState, children, onPress }) => {
  const { theme } = useTheme();
  const focused = accessibilityState.selected;

  const getPaddingTop = () => {
    if (height > 1100) {
      return 15;
    } else if (height > 800 && height < 980) {
      return 12;
    } else {
      return -10;
    }
  };

  const getPaddingBottom = () => {
    if (height > 1100) {
      return 20;
    } else if (height > 800 && height < 980) {
      return 15;
    } else {
      return -10;
    }
  };

  return (
    <TouchableHighlight
      underlayColor={theme.primaryLightShade.color}
      activeOpacity={1}
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: getPaddingTop(),
        paddingBottom: getPaddingBottom(),
        borderRadius: globalStyles.border.borderRadius,
      }}
    >
      {children}
    </TouchableHighlight>
  );
};

export default CustomTabBarButton;
