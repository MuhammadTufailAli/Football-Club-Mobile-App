import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Stack navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//importing Screens
import Reports from '../../PlayerScreens/Reports/Reports';
import MonthlyAttendance from '../../PlayerScreens/Reports/MonthlyAttendance';
import TrainingReportList from '../../PlayerScreens/Reports/TrainingReportList';
import PlayerNotification from '../../Components/PlayerNotification';
const ReportStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ReportsList" component={Reports} />
      <Stack.Screen name="MonthlyAttendance" component={MonthlyAttendance} />
      <Stack.Screen name="TrainingReportList" component={TrainingReportList} />
      <Stack.Screen name="PlayerNotification" component={PlayerNotification} />
    </Stack.Navigator>
  );
};

export default ReportStack;

const styles = StyleSheet.create({});
