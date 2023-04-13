import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
//importing Stacks
import LoginStack from '../Stack/StackNavigation/LoginStack';
import DrawerStack from '../Stack/Drawer/DrawerStack';
import ParentDrawerStack from '../Parent/Stack/Drawer/ParentDrawerStack';
import UserExtraInfoBeforeLogin from '../Components/UserExtraInfoBeforeLogin';
//import Context Api/Usefull things
import CartProvider from '../ContextApi/contextApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import port from '../Port/Port';

const Authentication = () => {
  const {userdetails, setuserdetails, setToken} = useContext(CartProvider);
  const [getcondition, setcondition] = useState(true);

  //Check if user is logged in before or not
  const CheckIfUserIsAuthentic = async () => {
    try {
      var jsonValue = await AsyncStorage.getItem('@token');

      if (jsonValue === null) {
        setuserdetails([]);
      } else {
        //Getting Data of user from backend
        var value = JSON.parse(jsonValue);
        const token = value.token;

        setToken(token);
        var decoded = jwt_decode(token);

        try {
          const result = await axios.get(
            `${port.herokuPort}/users/singleUser/${decoded.id}`,
          );

          setuserdetails(result.data.data.doc);
        } catch (err) {
          console.log('I am in error');
          console.log(err.response.data);
        }
      }

      setcondition(false);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  useEffect(() => {
    CheckIfUserIsAuthentic();
  }, []);
  if (getcondition) {
    <View>
      <Text>Fetchiang data for you</Text>
    </View>;
  } else {
    return (
      <>
        {userdetails?.isLoggedIn ? (
          userdetails?.role !== 'Player' ? (
            <ParentDrawerStack />
          ) : userdetails?.height === null ? (
            <UserExtraInfoBeforeLogin />
          ) : (
            <DrawerStack />
          )
        ) : (
          <LoginStack />
        )}
      </>
    );
  }
};

export default Authentication;

const styles = StyleSheet.create({});
