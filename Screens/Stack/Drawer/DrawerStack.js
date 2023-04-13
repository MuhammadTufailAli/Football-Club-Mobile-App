import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Font, Commonstyles} from '../../Font/Font';

//importing Icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

//imports screens
import TabStack from '../TabNavigation/TabStack';
import GroupStackNavigation from '../StackNavigation/GroupStackNavigation';

import ReportStack from '../StackNavigation/ReportStack';
import Schedule from '../../PlayerScreens/Schedule/Schedule';
import TabNavigationForEcommerce from '../TabNavigation/TabNavigationForEcommerce';

import CustomDrawer from './CustomDrawer';

//Import Drawer
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: Font.green,
          drawerActiveTintColor: Font.white,
          drawerInactiveTintColor: Font.greyText,
          drawerLabelStyle: {
            marginLeft: -18,
            fontSize: 16,
            fontFamily: Font.fontfamily,
            marginBottom: 8,
          },
        }}
        drawerContent={props => <CustomDrawer {...props} />}>
        <Drawer.Screen
          name="News Feed"
          component={TabStack}
          options={{
            drawerIcon: () => (
              <FontAwesome name="feed" size={28} color={'white'} />
            ),
          }}
        />
        <Drawer.Screen
          name="Groups"
          component={GroupStackNavigation}
          options={{
            drawerIcon: () => (
              <FontAwesome name="group" size={28} color={'white'} />
            ),
          }}
        />
        <Drawer.Screen
          name="Reports"
          component={ReportStack}
          options={{
            drawerIcon: () => (
              <Ionicons name="analytics-outline" size={28} color={'white'} />
            ),
          }}
        />
        <Drawer.Screen
          name="Schedule"
          component={Schedule}
          options={{
            drawerIcon: () => (
              <FontAwesome name="calendar" size={28} color={'white'} />
            ),
          }}
        />
        <Drawer.Screen
          name="Go to Shop"
          component={TabNavigationForEcommerce}
          options={{
            drawerIcon: () => (
              <FontAwesome name="shopping-bag" size={28} color={'white'} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerStack;

const styles = StyleSheet.create({});
