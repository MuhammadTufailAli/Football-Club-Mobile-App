import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';

import Loader from '../Loader/Loader';

//import font and design
import {Font, Commonstyles} from '../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Importing FlatList for comments

import CartProvider from '../ContextApi/contextApi';

import port from '../Port/Port';

const PlayerNotification = ({navigation}) => {
  const {userdetails, setuserdetails, setsocket} = useContext(CartProvider);
  const [notificationList, setNotificationList] = useState([]);
  const [cond, setCond] = useState(true);

  const getNotification = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/generalnotification/GetPlayerGeneralNotifications/${userdetails?._id}`,
      );

      setNotificationList(result.data.data.reverse());
      setCond(false);
    } catch (err) {
      console.log(err);
      alert(err.response.data);
    }
  };

  //getting all user Notification
  useEffect(() => {
    getNotification();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Font.black}}>
      {/* Top bar */}
      <View
        style={{
          height: 90,
          borderBottomWidth: 0.5,
          borderColor: Font.greyText,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: Font.grey,
        }}>
        {/* Drawer Button and heading */}
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            marginLeft: 15,
          }}>
          <TouchableOpacity
            style={{marginRight: 5}}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Ionicons
              name={'reorder-three-sharp'}
              size={32}
              color={Font.green}
            />
          </TouchableOpacity>
          <Text style={Commonstyles.LogoWhite}>Notification</Text>
        </View>
        {/* Notification icon */}
        <View
          style={{
            justifyContent: 'center',
            marginRight: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (userdetails?.role === 'Player') {
                navigation.navigate('PlayerNotification');
              } else {
                navigation.navigate('ParentNotification');
              }
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={28}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Waiting for notification */}
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View style={{marginLeft: 15, marginRight: 15}}>
          <FlatList
            contentContainerStyle={{paddingBottom: 194}}
            showsVerticalScrollIndicator={false}
            data={notificationList}
            renderItem={({item, index}) => {
              var icon = '';
              if (item?.Content.includes('Skills')) {
                icon = 'Skills';
              } else if (item?.Content.includes('added')) {
                icon = 'added';
              } else if (item?.Content.includes('Like')) {
                icon = 'Like';
              } else if (item?.Content.includes('Comment')) {
                icon = 'Comment';
              }
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  {icon === 'Skills' ? (
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        backgroundColor: Font?.green,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons
                        name="analytics-outline"
                        size={28}
                        color={'white'}
                      />
                    </View>
                  ) : icon === 'added' ? (
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        backgroundColor: Font?.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AntDesign
                        name={'pluscircleo'}
                        size={28}
                        color={Font.red}
                      />
                    </View>
                  ) : icon === 'Like' ? (
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        backgroundColor: Font?.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AntDesign name={'heart'} size={28} color={Font.green} />
                    </View>
                  ) : icon === 'Comment' ? (
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        backgroundColor: Font?.green,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <EvilIcons
                        name={'comment'}
                        size={32}
                        color={Font.green}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        backgroundColor: Font?.green,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons
                        name={'notifications-outline'}
                        size={28}
                        color={Font.white}
                      />
                    </View>
                  )}

                  <View style={{marginLeft: 10}}>
                    <Text style={Commonstyles?.TextWhite}>{item?.Content}</Text>
                    <View style={{marginTop: 5}}>
                      <Text style={Commonstyles?.TextGrey12}>
                        {moment(item?.createdAt).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default PlayerNotification;

const styles = StyleSheet.create({});
