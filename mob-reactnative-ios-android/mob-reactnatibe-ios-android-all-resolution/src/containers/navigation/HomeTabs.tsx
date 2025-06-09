import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Platform, StyleProp, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from '../../globalStyles';
import { useAppSelector } from '../../store/hooks';
import FoodMenu from '../FoodMenu';
import Header from '../Header';
import OrderStatus from '../OrderStatus';
import Transaction from '../Transaction';
import WeeklyMenu from '../WeeklyMenu';
import SignOut from './component/SignOut';
let { width } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const headerStyle = (): StyleProp<TextStyle> => {
  return Platform.OS === 'android'
    ? { backgroundColor: globalStyles.primary.color }
    : { backgroundColor: globalStyles.primary.color, height: width < 380 ? 75 : 110 };
};

const HomeTabsData = [
  {
    name: 'Food Menu',
    hi_name: 'भोजन मेन्यू',
    component: FoodMenu,
    tabBarIconName: 'restaurant',
    tabBarLabel: 'Food Menu',
  },
  {
    name: 'Weekly Menu',
    hi_name: 'साप्ताहिक मेनू',
    component: WeeklyMenu,
    tabBarIconName: 'restaurant-menu',
    tabBarLabel: 'Weekly Menu',
  },
  {
    name: 'Order Status',
    hi_name: 'ऑर्डर स्थिति',
    component: OrderStatus,
    tabBarIconName: 'check-circle',
    tabBarLabel: 'Order Status',
  },
  {
    name: 'Transaction',
    hi_name: 'लेन-देन',
    component: Transaction,
    tabBarIconName: 'history',
    tabBarLabel: 'Transaction',
  },
];

const HomeTabs = () => {
  const { notificationNavigate } = useAppSelector((state) => state.networkReducer);
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={!notificationNavigate ? 'Food Menu' : notificationNavigate}
        screenOptions={{
          headerTitleAlign: 'left',
        }}
      >
        {HomeTabsData.map((screen, index) => {
          return (
            <Tab.Screen
              key={index}
              name={screen.name}
              component={screen.component}
              options={{
                headerStyle: headerStyle(),
                headerTitleStyle: {
                  color: globalStyles.secondary.color,
                  fontSize:
                    width === 360 ? globalStyles.font_18.fontSize : globalStyles.font_20.fontSize,
                },
                headerRight: () => <Header />,
                headerLeft: () => <SignOut />,
                tabBarLabel: screen.tabBarLabel,
                tabBarActiveTintColor: globalStyles.primary.color,
                tabBarIcon: ({ color, size }) => (
                  <Icon name={screen.tabBarIconName} color={color} size={size} />
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default HomeTabs;
