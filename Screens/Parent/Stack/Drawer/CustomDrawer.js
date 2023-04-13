import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {Font, Commonstyles} from '../../../Font/Font';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

//importing axios
import axios from 'axios';
//importing port
import port from '../../../Port/Port';

//import Context Api
import CartProvider from '../../../ContextApi/contextApi';

import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

const CustomDrawer = props => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  return (
    <View style={{flex: 1, backgroundColor: Font.grey}}>
      <View
        style={{
          marginLeft: 12,
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
          }}>
          <Entypo name="cross" size={32} color={'white'} />
        </TouchableOpacity>

        <Text
          style={{
            color: Font.white,
            marginLeft: 10,
            fontSize: 16,
            fontFamily: Font.fontfamily,
          }}>
          Menu
        </Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <View style={{marginTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderColor: Font.greyText,
        }}>
        <TouchableOpacity
          onPress={async () => {
            const loggedIn = {
              isLoggedIn: false,
            };
            try {
              const result = await axios.put(
                `${port.herokuPort}/users/updateUser/${userdetails?.id}`,
                loggedIn,
              );

              setuserdetails();
            } catch (err) {
              console.log(err);
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Feather name="log-out" size={28} color={'white'} />
          <Text
            style={{
              color: Font.white,
              marginLeft: 10,
              fontSize: 16,
              fontFamily: Font.fontfamily,
            }}>
            Signout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
