import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//importing Screens
import Reports from '../../ParentScreens/Reports/Reports';
import MonthlyAttendance from '../../ParentScreens/Reports/MonthlyAttendance';
import TrainingReportList from '../../ParentScreens/Reports/TrainingReportList';
import ParentNotification from '../../../Components/ParentNotification';

const ReportStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ReportsList" component={Reports} />
      <Stack.Screen name="MonthlyAttendance" component={MonthlyAttendance} />
      <Stack.Screen name="TrainingReportList" component={TrainingReportList} />
      <Stack.Screen name="ParentNotification" component={ParentNotification} />
    </Stack.Navigator>
  );
};

export default ReportStack;

const styles = StyleSheet.create({});
