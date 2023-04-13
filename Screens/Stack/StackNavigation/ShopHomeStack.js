import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import ShopHome from '../../PlayerScreens/Shop/ShopHome/ShopHome';
import SingleProduct from '../../PlayerScreens/Shop/ShopHome/SingleProduct';
import Checkout from '../../PlayerScreens/Shop/ShopHome/Checkout';
import PlayerNotification from '../../Components/PlayerNotification';

const ShopHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ShopHomeList" component={ShopHome} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default ShopHomeStack;

const styles = StyleSheet.create({});
