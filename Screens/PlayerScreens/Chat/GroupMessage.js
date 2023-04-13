import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import axios from 'axios';

import port from '../../Port/Port';
import CartProvider from '../../ContextApi/contextApi';
//import font and design
import {Font, Commonstyles} from '../../Font/Font';
import moment from 'moment';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const GroupMessage = ({message}) => {
  const {userdetails, setuserdetails, token, socket} = useContext(CartProvider);

  if (message?.content?.length > 3) {
    var extension = message?.content.substr(message?.content?.length - 4);
    if (extension.charAt(0) === '.') {
      var extension = message?.content.substr(message?.content?.length - 3);
      if (extension === 'jpg' || extension === 'png' || extension === 'gif') {
        var image = true;
      }
    }
  }
  return (
    <View style={{marginTop: 10}}>
      {message?.sender == userdetails?._id ? (
        <View style={{marginLeft: 15, marginBottom: 5, marginTop: 5}}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Image
                source={{
                  uri: userdetails?.image,
                }}
                style={{
                  width: 46,
                  height: 46,

                  borderRadius: 90 / 2,
                }}
              />
            </View>
            <View style={{marginLeft: 10, marginRight: 10}}>
              <Text style={Commonstyles?.TextWhiteUserName}>
                {userdetails?.name}
                {'   '}
                <Text style={Commonstyles?.TextGrey12}>
                  {moment(message.timestamp).fromNow()}
                </Text>
              </Text>
              {image ? (
                <Image
                  source={{
                    uri: message?.content,
                  }}
                  style={{
                    width: 146,
                    height: 146,

                    borderRadius: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: '#EDEDED',
                    padding: 9,
                    width: '80%',

                    borderTopRightRadius: 50,
                    borderBottomRightRadius: 50,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 50,
                    marginTop: 7,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lexend-Regular',
                      fontSize: 13,
                      fontWeight: '300',

                      color: '#000000',
                      opacity: 0.72,
                    }}>
                    {message?.content}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'flex-end',
            marginRight: 15,
            marginBottom: 5,
            marginRight: 10,
            marginTop: 5,
          }}>
          <View
            style={{
              flexDirection: 'row-reverse',
            }}>
            {/* <View>
              <Image
                source={{
                  uri: otherUser?.image,
                }}
                style={{
                  width: 46,
                  height: 46,

                  borderRadius: 90 / 2,
                }}
              />
            </View> */}
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,

                alignItems: 'flex-end',
              }}>
              <Text style={Commonstyles?.TextWhiteUserName}>
                <Text style={Commonstyles?.TextGrey12}>
                  {moment(message.timestamp).fromNow()}
                </Text>
                {/* {'   '}
                {otherUser?.name} */}
              </Text>
              {image ? (
                <Image
                  source={{
                    uri: message?.content,
                  }}
                  style={{
                    width: 146,
                    height: 146,

                    borderRadius: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: Font.grey,
                    padding: 9,
                    width: '80%',

                    borderTopLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    borderTopRightRadius: 5,
                    borderBottomLeftRadius: 50,
                    marginTop: 7,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lexend-Regular',
                      fontSize: 13,
                      fontWeight: '300',

                      color: 'white',
                    }}>
                    {message?.content}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default GroupMessage;

const styles = StyleSheet.create({});
