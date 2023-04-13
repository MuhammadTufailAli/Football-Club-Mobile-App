import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

const Message = ({message}) => {
  return (
    <View style={{marginTop: 10}}>
      {message?.sender === 'Shaheer Ahmed' ? (
        <View style={{marginLeft: 15, marginBottom: 5, marginTop: 5}}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Image
                source={{
                  uri: message?.PhotoUrl,
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
                {message?.sender}
                {'   '}
                <Text style={Commonstyles?.TextGrey12}>{message?.time}</Text>
              </Text>
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
                  {message?.text}
                </Text>
              </View>
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
            <View>
              <Image
                source={{
                  uri: message?.PhotoUrl,
                }}
                style={{
                  width: 46,
                  height: 46,

                  borderRadius: 90 / 2,
                }}
              />
            </View>
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,

                alignItems: 'flex-end',
              }}>
              <Text style={Commonstyles?.TextWhiteUserName}>
                <Text style={Commonstyles?.TextGrey12}>{message?.time}</Text>
                {'   '}
                {message?.sender}
              </Text>
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
                  {message?.text}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({});
