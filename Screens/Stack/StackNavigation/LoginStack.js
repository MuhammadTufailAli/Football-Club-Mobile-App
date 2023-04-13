import 'react-native-gesture-handler';
import * as React from 'react';
import {View, Text} from 'react-native';

//importing Screens
import WelcomeScreen from '../../UserProfiling/WelcomeScreen';
import LoginScreen from '../../UserProfiling/LoginScreen';
import SignupScreen from '../../UserProfiling/SignupScreen';
import PlayerNotification from '../../Components/PlayerNotification';


//Importing Stack Navigator
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function LoginStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen
          name="PlayerNotification"
          component={PlayerNotification}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default LoginStack;
