import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Importing Screens
import Groups from '../../ParentScreens/Groups/Groups';
import IndividualGroup from '../../../PlayerScreens/Groups/IndividualGroup';
import IndividualGroupDetails from '../../../PlayerScreens/Groups/IndividualGroupDetails';
import IndividualGroupMembers from '../../../PlayerScreens/Groups/IndividualGroupMembers';
import GroupAddPost from '../../../PlayerScreens/Groups/GroupAddPost';
import IndividualPost from '../../../Components/IndividualPost';
import Comments from '../../../Components/Comments';
import ParentNotification from '../../../Components/ParentNotification';
//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const GroupStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="GroupList" component={Groups} />
      <Stack.Screen name="IndividualGroup" component={IndividualGroup} />
      <Stack.Screen
        name="IndividualGroupDetails"
        component={IndividualGroupDetails}
      />
      <Stack.Screen
        name="IndividualGroupMembers"
        component={IndividualGroupMembers}
      />
      <Stack.Screen name="GroupAddPost" component={GroupAddPost} />
      <Stack.Screen name="IndividualPost" component={IndividualPost} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="ParentNotification" component={ParentNotification} />
    </Stack.Navigator>
  );
};

export default GroupStackNavigation;

const styles = StyleSheet.create({});
