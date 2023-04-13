import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import OrdersList from '../../PlayerScreens/Shop/Orders/Orders';
import Recipt from '../../PlayerScreens/Shop/Orders/Recipt';
import PlayerNotification from '../../Components/PlayerNotification';

const OrdersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OrdersList" component={OrdersList} />
      <Stack.Screen name="Recipt" component={Recipt} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default OrdersStack;

const styles = StyleSheet.create({});
