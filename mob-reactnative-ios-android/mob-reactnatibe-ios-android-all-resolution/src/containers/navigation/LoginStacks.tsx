import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SignUp from '../SignUp';

const Stack = createStackNavigator();

const LoginStack: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default LoginStack;
