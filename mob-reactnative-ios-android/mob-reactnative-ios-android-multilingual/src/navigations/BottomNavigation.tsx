import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { Dimensions, Platform, StyleProp, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FoodMenu from '../containers/FoodMenu/FoodMenu';
import Grocery from '../containers/Grocery/Grocery';
import Order from '../containers/Order/Order';
import Transaction from '../containers/Transaction/Transaction';
import WeeklyMenu from '../containers/WeeklyMenu/WeeklyMenu';
import { globalStyles } from '../globalStyles';
import { useAppSelector } from '../store/hooks';
import { HeaderLeft, HeaderRight } from './components/Header';

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get('window');

const headerStyle = (): StyleProp<TextStyle> => {
  return Platform.OS === 'android'
    ? { backgroundColor: globalStyles.primary.color }
    : { backgroundColor: globalStyles.primary.color, height: width < 380 ? 75 : 110 };
};

export const navigations = [
  {
    name: 'Food Menu',
    hi_name: 'भोजन मेन्यू',
    component: FoodMenu,
    tabBarIconName: 'restaurant-menu',
    headerLeft: HeaderLeft,
    headerRight: null,
    tabBarLabel: 'Food Menu',
  },
  {
    name: 'Weekly Menu',
    hi_name: 'साप्ताहिक मेन्यू',
    component: WeeklyMenu,
    tabBarIconName: 'calendar-view-week',
    headerLeft: HeaderLeft,
    headerRight: null,
    tabBarLabel: 'Weekly Menu',
  },
  {
    name: 'Order',
    hi_name: 'ऑर्डर',
    component: Order,
    tabBarIconName: 'list',
    headerLeft: HeaderLeft,
    headerRight: null,
    tabBarLabel: 'Order',
  },
  {
    name: 'Transaction',
    hi_name: 'लेन-देन',
    component: Transaction,
    tabBarIconName: 'monetization-on',
    headerLeft: HeaderLeft,
    headerRight: HeaderRight,
    tabBarLabel: 'Transaction',
  },
  {
    name: 'Grocery',
    hi_name: 'किराना',
    component: Grocery,
    tabBarIconName: 'shopping-bag',
    headerLeft: HeaderLeft,
    headerRight: null,
    tabBarLabel: 'Grocery',
  },
];

const BottomNavigation = () => {
  const { theme }: any = useTheme();
  const { notificationNavigate } = useAppSelector((state) => state.navigation);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={!notificationNavigate ? 'भोजन मेन्यू' : notificationNavigate}
        screenOptions={{
          headerTitleAlign: 'left',
        }}
      >
        {navigations.map((screen, index) => {
          return (
            <Tab.Screen
              key={index}
              name={screen.hi_name}
              component={screen.component}
              options={{
                headerStyle: headerStyle(),
                headerTitleStyle: {
                  color: globalStyles.secondary.color,
                  fontSize:
                    width === 360 ? globalStyles.font_20.fontSize : globalStyles.font_24.fontSize,
                },
                headerRight: screen.headerRight,
                headerLeft: screen.headerLeft,
                tabBarStyle: {
                  height: 50,
                  elevation: Platform.OS === 'android' ? 4 : 10,
                },
                tabBarLabel: screen.hi_name,
                tabBarActiveTintColor: globalStyles.primary.color,
                tabBarInactiveTintColor: '#0F0F0F',
                tabBarLabelStyle: {
                  fontSize: globalStyles.font_16.fontSize,
                  fontWeight: '500',
                },
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name={screen.tabBarIconName} color={color} size={size} />
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavigation;
