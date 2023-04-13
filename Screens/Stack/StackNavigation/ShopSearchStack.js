import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import ShopSearch from '../../PlayerScreens/Shop/ShopSearch/ShopSearch';
import PlayerNotification from '../../Components/PlayerNotification';

const ShopSearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ShopSearch" component={ShopSearch} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default ShopSearchStack;

const styles = StyleSheet.create({});
