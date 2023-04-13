import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//Importing Screens
import Chat from '../../ParentScreens/Chat/Chat';
import IndividualChat from '../../../PlayerScreens/Chat/IndividualChat';
import SearchUser from '../../../PlayerScreens/Chat/SearchUser';
import ChatScreen from '../../../PlayerScreens/Chat/ChatScreen';
import ChatScreenGroup from '../../../PlayerScreens/Chat/ChatScreenGroup';
import ParentNotification from '../../../Components/ParentNotification';
const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ChatList" component={Chat} />
      <Stack.Screen name="IndividualChat" component={IndividualChat} />
      <Stack.Screen name="SearchUser" component={SearchUser} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChatScreenGroup" component={ChatScreenGroup} />
      <Stack.Screen name="ParentNotification" component={ParentNotification} />
    </Stack.Navigator>
  );
};

export default ChatStack;

const styles = StyleSheet.create({});
