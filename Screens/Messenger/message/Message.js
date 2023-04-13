import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import axios from 'axios';
import CartProvider from '../../ContextApi/contextApi';
import port from '../../Port/Port';
import moment from 'moment';
import {Font} from '../../font/Font';
function Message({message, own, otherUser}) {
  var t = new Date(message.createdAt);
  var formatted =
    ('0' + t.getDate()).slice(-2) +
    '/' +
    ('0' + t.getMonth()).slice(-2) +
    '/' +
    t.getFullYear() +
    ' ' +
    ('0' + t.getHours()).slice(-2);

  return (
    <View>
      {own ? (
        <View style={{marginLeft: 8, marginBottom: 5, marginTop: 5}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{
                uri: otherUser?.photoUrl,
              }}
              style={{
                width: 28,
                height: 28,

                borderRadius: 90 / 2,
              }}
            />
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 5,
                backgroundColor: '#e4e6eb',
                padding: 7,
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 50,
                color: Font.TextColor,
                fontFamily: 'Lexend-Regular',
                fontWeight: '400',
              }}>
              {message.text}
            </Text>
          </View>
          <Text
            style={{
              marginLeft: 40,
              color: Font.LightColor,
              fontFamily: 'Lexend-Regular',
              fontWeight: '400',
            }}>
            {moment(message.createdAt).fromNow()}
          </Text>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'flex-end',
            marginRight: 8,
            marginBottom: 5,
            marginTop: 5,
          }}>
          <Text
            style={{
              backgroundColor: '#ad02ad',
              color: 'white',
              padding: 7,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 50,
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
              fontFamily: 'Lexend-Regular',
              fontWeight: '400',
            }}>
            {message.text}
          </Text>
          <Text style={{color: Font.LightColor}}>
            {moment(message.createdAt).fromNow()}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Message;
