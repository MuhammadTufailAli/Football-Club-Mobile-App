import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Import FontColor
import {Font, Commonstyles} from '../../Font/Font';

//Importing Screens
import ShopHomeStack from '../StackNavigation/ShopHomeStack';
import MyCartStack from '../StackNavigation/MyCartStack';
import ShopSearchStack from '../StackNavigation/ShopSearchStack';
import OrdersStack from '../StackNavigation/OrdersStack';
import Setting from '../../PlayerScreens/Shop/Setting';

//importing Icons
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import tab navigation
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const TabNavigationForEcommerce = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,

        tabBarIcon: ({focused, color, size}) => {
          size = 28;
          if (route.name === 'ShopHome') {
            return <Entypo name={'home'} size={size} color={color} />;
          } else if (route.name === 'Cart') {
            return (
              <MaterialCommunityIcons
                name="shopping-outline"
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Search') {
            return <AntDesign name="search1" size={size} color={color} />;
          } else if (route.name === 'Order') {
            return <Entypo name="box" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: Font.green,
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: Font.black,
          position: 'absolute',

          borderTopWidth: 0.5,
          borderColor: Font.greyText,
        },
      })}>
      <Tab.Screen
        name="ShopHome"
        component={ShopHomeStack}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="Cart"
        component={MyCartStack}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="Search"
        component={ShopSearchStack}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen
        name="Order"
        component={OrdersStack}
        options={{unmountOnBlur: true}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigationForEcommerce;

const styles = StyleSheet.create({});
