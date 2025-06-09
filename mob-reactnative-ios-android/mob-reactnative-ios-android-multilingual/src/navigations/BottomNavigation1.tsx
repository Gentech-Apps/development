// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import React, { JSX } from 'react';
// import { Dimensions, Image, Platform, StyleProp, TextStyle } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useTheme } from '../ThemeProvider';
// import { globalStyles } from '../globalStyles';
// import { useAppDispatch, useAppSelector } from '../store/hooks';
// import CustomTabBarButton from './components/CustomTabBarButton';
// import { navigationState } from './redux/interface';
// import { updateNav } from './redux/slice';

// const Tab = createBottomTabNavigator();

// const { width, height } = Dimensions.get('window');

// const BottomNavigation = (): JSX.Element => {
//   const { theme }: any = useTheme();
//   const navigation = useAppSelector((state) => state.navigation);
//   const dispatch = useAppDispatch();

//   const getColor = (nav: navigationState) => {
//     return nav.active ? theme.bottomTabActive.color : theme.bottomTabDefault.color; //'#424242'; //'#d4d4d4';
//   };

//   const getFontSize = (nav: navigationState) => {
//     return nav.active ? 35 : 30;
//   };

//   const getTabBarLabelStyle = (nav: navigationState): StyleProp<TextStyle> => {
//     return nav.active
//       ? { color: theme.bottomTabActive.color, fontSize: 15, left: width > 600 ? -9 : 0 }
//       : { display: 'none' };
//   };

//   const handleTabPress = (nav: any) => {
//     dispatch(updateNav(nav));
//   };

//   const headerTitleStyle = (): StyleProp<TextStyle> => {
//     return Platform.OS === 'android'
//       ? { color: globalStyles.secondary.color, fontSize: 24 }
//       : { color: globalStyles.secondary.color, fontSize: 24 };
//   };

//   const headerStyle = (): StyleProp<TextStyle> => {
//     return Platform.OS === 'android'
//       ? { backgroundColor: globalStyles.primary.color }
//       : { backgroundColor: globalStyles.primary.color, height: 110 };
//   };

//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         initialRouteName="FoodMenu"
//         screenOptions={{
//           tabBarButton: (props) => <CustomTabBarButton {...props} />,
//           lazy: true,
//           headerTitleAlign: 'left',
//           headerTitleStyle: headerTitleStyle(),
//           headerLeft: () => (
//             <Image
//               style={{ width: 45, height: 45, marginLeft: 10 }}
//               source={require('../assets/images/ic_icon_round.png')}
//             />
//           ),
//           tabBarStyle: {
//             backgroundColor: theme.bottomTabDefault.backgroundColor,
//             height: Platform.OS === 'android' ? (height > 1100 ? 70 : 60) : 85,
//             borderTopWidth: Platform.OS === 'android' ? 0 : 1,
//             elevation: Platform.OS === 'android' ? 4 : 10,
//           },
//           headerStyle: headerStyle(),
//         }}
//       >
//         {navigation.map((nav, index) => {
//           return (
//             <Tab.Screen
//               key={index}
//               name={nav.hi_name}
//               component={nav.component}
//               options={{
//                 tabBarLabelStyle: getTabBarLabelStyle(nav),
//                 tabBarIcon: () => (
//                   <MaterialIcons
//                     name={nav.tabBarIconName}
//                     color={getColor(nav)}
//                     size={getFontSize(nav)}
//                   />
//                 ),
//                 headerLeft: nav.headerLeft,
//                 headerRight: nav.headerRight,
//               }}
//               listeners={{
//                 tabPress: () => handleTabPress(nav),
//               }}
//             />
//           );
//         })}
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default BottomNavigation;
