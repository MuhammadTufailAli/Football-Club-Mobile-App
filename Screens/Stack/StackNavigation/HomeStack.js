import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import HomeScreen from '../../PlayerScreens/Home/HomeScreen';
import IndividualPost from '../../Components/IndividualPost';
import Comments from '../../Components/Comments';
import PlayerNotification from '../../Components/PlayerNotification';

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreenList" component={HomeScreen} />
      <Stack.Screen name="IndividualPost" component={IndividualPost} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
