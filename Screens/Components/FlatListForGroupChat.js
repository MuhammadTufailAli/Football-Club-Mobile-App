import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import CartProvider from '../ContextApi/contextApi';
import moment from 'moment';

//importing icons
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//import font and design
import {Font, Commonstyles} from '../Font/Font';

const FlatListForGroupChat = ({ChatListArray, navigation}) => {
  const {userdetails, setuserdetails, setsocket} = useContext(CartProvider);

  return (
    <View style={{marginLeft: 15, marginRight: 15}}>
      <FlatList
        contentContainerStyle={{paddingBottom: 360}}
        showsVerticalScrollIndicator={false}
        data={ChatListArray}
        renderItem={({item, index}) => {
          //   var receiverUser = {};
          //   item?.members?.map(data => {
          //     if (data?._id != userdetails?._id) {
          //       receiverUser = data;
          //     }
          //   });
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChatScreenGroup', {
                  currentChat: item,
                });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 13,
                paddingBottom: 17,
                borderBottomWidth: 1,
                borderColor: Font.grey,
              }}>
              {/* Left Side */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <Image
                    source={{
                      uri: item?.groupimage,
                    }}
                    style={{
                      width: 42,
                      height: 42,

                      borderRadius: 90 / 2,
                    }}
                  />
                </View>
                <View style={{marginLeft: 10, marginRight: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={Commonstyles?.TextWhiteMembers}>
                      {item?.name}{' '}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Side */}
              <View>
                <Text style={Commonstyles?.TextGrey12}></Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default FlatListForGroupChat;

const styles = StyleSheet.create({});
