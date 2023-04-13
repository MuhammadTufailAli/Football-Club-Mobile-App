import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import Drills from '../../PlayerScreens/Drills/Drills';
import IndividualDrill from '../../Components/IndividualDrill';
import PlayerNotification from '../../Components/PlayerNotification';

const DrillsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DrillsPage" component={Drills} />
      <Stack.Screen name="IndividualDrill" component={IndividualDrill} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default DrillsStack;

const styles = StyleSheet.create({});
