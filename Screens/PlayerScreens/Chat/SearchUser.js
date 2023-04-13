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
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';

import port from '../../Port/Port';
import CartProvider from '../../ContextApi/contextApi';
//import font and design
import {Font, Commonstyles} from '../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchUser = ({navigation, route}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [totalData, setTotalData] = useState(route.params?.users);
  const [dataToshow, setdataToshow] = useState(route.params?.users);

  const findConversation = async otherUser => {
    console.log('Other user id is:', otherUser);
    try {
      const result = await axios.get(
        `${port.herokuPort}/conversation/find/${userdetails._id}/${otherUser}`,
      );

      console.log(result.data.data);
      if (result.data.data) {
        navigation.navigate('ChatScreen', {
          currentChat: result.data.data,
          from: 'oldChat',
          OnlyView: 'No',
        });
      } else {
        const userDetails = {
          senderId: userdetails._id,
          receiverId: otherUser,
        };

        console.log('UserDetails for chat', userDetails);
        try {
          const result = await axios.post(
            `${port.herokuPort}/conversation`,
            userDetails,
          );

          navigation.navigate('ChatScreen', {
            currentChat: result.data,
            from: 'newChat',
            OnlyView: 'No',
          });
        } catch (err) {
          console.log(err);
          alert('Error');
        }
      }
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  };

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
          <Text style={Commonstyles.LogoWhite}>Searching User</Text>
        </View>
      </View>

      {/* Search User */}

      <View
        style={{
          justifyContent: 'center',
          margin: 15,
        }}>
        <TextInput
          name="email"
          style={Commonstyles.inputText}
          placeholder="Search user"
          placeholderTextColor={Font.greyText}
          onChangeText={text => {
            text = text.toLowerCase();
            setdataToshow(
              totalData.filter(obj => {
                var fullname = obj.name.toLowerCase();

                if (fullname.includes(text)) {
                  return obj;
                }
              }),
            );
          }}
        />
        <AntDesign
          name={'search1'}
          size={22}
          color={Font.greyText}
          style={{
            position: 'absolute',
            right: 10,
          }}
        />
      </View>

      {/* User List */}
      <View style={{margin: 15, marginTop: 0}}>
        <FlatList
          data={dataToshow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 244}}
          initialNumToRender={10}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 8,

                  borderBottomWidth: 0.5,
                  borderColor: 'grey',
                  paddingBottom: 5,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    findConversation(item?._id);
                  }}>
                  <Image
                    source={{
                      uri: item?.image,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 90 / 2,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: Font.TextColor,
                      fontFamily: 'Lexend-Regular',
                    }}>
                    {item?.name}
                  </Text>
                  {item?.role ? (
                    <Text
                      style={{
                        fontFamily: 'Lexend-Light',
                        fontSize: 10,
                        fontWeight: '300',
                        color: '#FFFFFF',
                        backgroundColor:
                          item?.role === 'Admin'
                            ? Font.green
                            : item?.role === 'Coach'
                            ? Font.blue2
                            : Font.greyText,
                        borderRadius: 5,
                        width: 45,
                        height: 19,
                        textAlign: 'center',
                        marginLeft: 10,
                      }}>
                      {item?.role}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchUser;

const styles = StyleSheet.create({});
