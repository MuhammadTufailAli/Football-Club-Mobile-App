import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../ContextApi/contextApi';
import port from '../Port/Port';
import {useIsFocused} from '@react-navigation/native';

import Video from 'react-native-video';

import moment from 'moment';

//import font and design
import {Font, Commonstyles} from '../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const IndividualDrill = ({navigation, route}) => {
  const item = route?.params?.drill;
  const Date = moment(item?.createdAt).utc().format('MM/DD/YYYY');
  const {userdetails, setuserdetails} = useContext(CartProvider);
  return (
    <ScrollView style={{flex: 1, backgroundColor: Font.black}}>
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
              navigation.goBack();
            }}>
            <AntDesign name={'left'} size={20} color={Font.white} />
          </TouchableOpacity>
          <Text style={Commonstyles.TextWhiteCalender}>
            {item?.refOfUser?.name}
            {'\n'}
            <Text style={Commonstyles.TextGrey}>Post</Text>
          </Text>
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

      <View style={{borderRadius: 10, marginTop: 15}}>
        <View style={styles.allViewStyle}>
          <Video
            source={{uri: item?.video}}
            repeat={true}
            controls={true}
            resizeMode="cover"
            ref={ref => {
              this.player = ref;
            }} // Store reference
            onBuffer={this.onBuffer}
            onError={this.videoError}
            style={{
              width: '100%',
              height: 207,

              borderRadius: 8,
            }}
          />
        </View>
        {/* Video details */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 15,
            marginRight: 15,
            marginTop: 15,
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',
              flex: 6,
            }}>
            <Image
              source={{
                uri: item?.refOfUser?.image,
              }}
              style={{
                width: 34,
                height: 34,

                borderRadius: 90 / 2,
              }}
            />
            <View style={{marginLeft: 10}}>
              <View>
                <Text style={Commonstyles.TextWhiteMembersName}>
                  {item?.drilltitle}
                </Text>
              </View>

              <View style={{marginTop: 10, width: '95%'}}>
                <Text style={Commonstyles.TextWhite12300}>
                  {item?.description}
                </Text>
              </View>
              <View style={{marginTop: 5}}>
                <Text style={Commonstyles.TextGreysmallmini}>{Date}</Text>
              </View>
            </View>
          </View>

          <View style={{justifyContent: 'center', flex: 1.5}}>
            <View
              style={{
                height: 27,
                width: 76,
                borderRadius: 5,

                alignItems: 'center',
                justifyContent: 'center',

                borderWidth: 1,
                backgroundColor: Font.green,
              }}>
              <Text
                style={{
                  fontFamily: 'Lexend-Light',
                  fontSize: 10,
                  fontWeight: '300',
                  color: '#FFFFFF',
                }}>
                {item?.refOfVideoCat?.title}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default IndividualDrill;

const styles = StyleSheet.create({
  allViewStyle: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
  },
});
