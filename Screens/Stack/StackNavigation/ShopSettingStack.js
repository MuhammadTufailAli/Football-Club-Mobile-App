import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import SettingList from '../../PlayerScreens/Setting/Setting';

import ChangeEmail from '../../PlayerScreens/Setting/ChangeEmail';
import ChangePassword from '../../PlayerScreens/Setting/ChangePassword';
import ChangeNumber from '../../PlayerScreens/Setting/ChangeNumber';
import PlayerNotification from '../../Components/PlayerNotification';

const ShopSettingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ShopSettingList" component={SettingList} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ChangeNumber" component={ChangeNumber} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default ShopSettingStack;

const styles = StyleSheet.create({});
