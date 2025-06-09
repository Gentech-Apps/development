import { useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { globalStyles } from '../../globalStyles';
import { trimString } from '../../utils/helper';
const { width } = Dimensions.get('window');

type AccordianProps = {
  item: {
    dayId?: number;
    dayHindi: string;
    day?: string;
    subType: [
      {
        weeklyMenuId: number;
        breakfast: string;
        breakfastHindi: string;
        lunch: string;
        eveningSnack: string;
        dinner: string;
        day: string;
        dayId: number;
        dinnerHindi: string;
        eveningSnackHindi: string;
        lunchHindi: string;
        message: string;
        status: string;
      },
    ];
  };
};
const WeeklyMenuAccordian = ({ item }: AccordianProps) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const toggleAccordion = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5000],
  });

  return (
    <View key={item?.dayId}>
      <TouchableHighlight
        style={{ marginTop: 5 }}
        underlayColor={globalStyles.primary.color}
        onPress={toggleAccordion}
      >
        <View
          style={[
            width !== 360 && styles.headerContainer,
            width === 360 && styles.with360headerContainer,
          ]}
        >
          <Text
            style={[styles.headerText, globalStyles.font_18, width === 360 && globalStyles.font_16]}
          >
            {trimString(item?.day)}
          </Text>
          <Animated.Text style={[styles.arrowIcon, { transform: [{ rotate: rotateArrow }] }]}>
            &#9662;
          </Animated.Text>
        </View>
      </TouchableHighlight>
      <Animated.View style={[styles.animatedViewContainer, { maxHeight: contentHeight }]}>
        {item?.subType?.length
          ? item?.subType?.map((sub, index) => (
              <View key={sub?.weeklyMenuId} style={styles.contentContainer}>
                <Text style={[styles.textContent]}>
                  <Text style={[styles.label, globalStyles.primaryDarkShade]}>Breakfast : </Text>
                  {trimString(sub?.breakfast)}
                </Text>
                <Text style={[styles.textContent]}>
                  <Text style={[styles.label, globalStyles.primaryDarkShade]}>Lunch : </Text>
                  {trimString(sub?.lunch)}
                </Text>
                <Text style={[styles.textContent]}>
                  <Text style={[styles.label, globalStyles.primaryDarkShade]}>
                    Evening Snack :{' '}
                  </Text>
                  {trimString(sub?.eveningSnack)}
                </Text>
                <Text style={[styles.textContent]}>
                  <Text style={[styles.label, globalStyles.primaryDarkShade]}>Dinner : </Text>
                  {trimString(sub?.dinner)}
                </Text>
              </View>
            ))
          : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContent: {
    ...globalStyles.primaryText,
    fontSize: width === 360 ? globalStyles.font_14.fontSize : globalStyles.font_16.fontSize,
    paddingBottom: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: globalStyles.primary.color,
    color: globalStyles.secondary.color,
    width: Platform.OS === 'ios' ? width - 10 : width,
  },
  with360headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: globalStyles.primary.color,
    color: globalStyles.secondary.color,
    width: Platform.OS === 'ios' ? width - 10 : width,
  },
  headerText: { fontWeight: '500', ...globalStyles.secondary },
  label: { width: '20%', minWidth: '20%', color: globalStyles.primary.color },
  arrowIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    ...globalStyles.secondary,
    transform: [{ rotate: '0deg' }],
  },
  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: globalStyles.primaryLightShade.color, //'#f5f5f5',
  },
  with360: {
    paddingHorizontal: 15,
  },
  animatedViewContainer: {
    overflow: 'hidden',
  },
});

export default WeeklyMenuAccordian;
