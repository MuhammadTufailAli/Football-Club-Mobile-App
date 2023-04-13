import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import port from '../../../Port/Port';
import CartProvider from '../../../ContextApi/contextApi';
import {io} from 'socket.io-client';
//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

import Loader from '../../../Loader/Loader';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

//importing Flatlist for chat
import FlatListForChat from '../../../Components/FlatListForChat';
import FlatListForGroupChat from '../../../Components/FlatListForGroupChat';

const Chat = ({navigation}) => {
  var Nav = navigation;

  //Creating a toggle button between parent and player chat
  const [whoseChat, SetwhoseChat] = useState('Player');

  const socket = useRef();
  const {userdetails, setuserdetails, setsocket} = useContext(CartProvider);
  const isFocused = useIsFocused();
  const [conversation, setConversation] = useState([]);
  const [Parentconversation, setParentConversation] = useState([]);
  const [allUsers, setAllusers] = useState([]);
  const [condition, setCondition] = useState(true);
  const [groupconversation, setGroupConversation] = useState([]);

  //getting all conversations and users

  const getConversation = async () => {
    try {
      const result = await axios.get(`${port.herokuPort}/users/allUsers`);

      setAllusers(
        result.data.data.doc.filter(
          item => item.role != 'Player' && item.role != 'Parent',
        ),
      );
    } catch (err) {
      console.log(err);
      alert(err.response.data);
    }

    try {
      const result = await axios.get(
        `${port.herokuPort}/conversation/${userdetails?.refOfPlayer}`,
      );

      setConversation(result.data.data.reverse());
    } catch (err) {
      console.log(err);
      alert('Error');
    }

    try {
      const result = await axios.get(
        `${port.herokuPort}/conversation/${userdetails?._id}`,
      );

      setParentConversation(result.data.data.reverse());
    } catch (err) {
      console.log(err);
      alert('Error');
    }

    try {
      const result = await axios.get(
        `${port.herokuPort}/groupconversation/GetGroupChat/${userdetails?.refOfPlayer}`,
      );

      setGroupConversation(result.data.data.reverse());
      setCondition(false);
    } catch (err) {
      console.log(err);
      alert(err.response.data);
    }
  };

  //getting all conversations and users
  useEffect(() => {
    isFocused && getConversation();
  }, [isFocused]);

  //To connect to server using socket io
  useEffect(() => {
    socket.current = io(`${port.socketPort}`);

    const obj = {current: socket.current};
    setsocket(obj);
  }, []);

  //Adding user to socket io
  useEffect(() => {
    socket.current.emit('addUser', userdetails._id);
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
          <Text style={Commonstyles.LogoWhite}>Chat</Text>
        </View>
        {/* Notification icon */}
        <View
          style={{
            justifyContent: 'center',
            marginRight: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ParentNotification');
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={28}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {condition ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View>
          {/* Selecting Parent or player chat */}
          <View
            style={{
              margin: 15,
              marginBottom: 0,

              backgroundColor: Font.grey,
              height: 52,

              borderRadius: 26,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  SetwhoseChat('Player');
                }}
                style={{
                  flex: 1,
                  backgroundColor: whoseChat === 'Player' ? Font.green : null,
                  borderRadius: 25,
                  height: 39,
                  width: '34%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }}>
                <Text style={Commonstyles.TextWhiteFeed}>Child Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  SetwhoseChat('Parent');
                }}
                style={{
                  flex: 1,
                  backgroundColor: whoseChat === 'Parent' ? Font.green : null,
                  borderRadius: 25,
                  height: 39,
                  width: '32%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={Commonstyles.TextWhiteFeed}>Parent Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  SetwhoseChat('group');
                }}
                style={{
                  flex: 1,
                  backgroundColor: whoseChat === 'group' ? Font.green : null,
                  borderRadius: 25,
                  height: 39,
                  width: '34%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }}>
                <Text style={Commonstyles.TextWhiteFeed}>Group Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
          {whoseChat === 'Parent' ? (
            <View>
              {/* Search User */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SearchUser', {users: allUsers});
                }}>
                <View
                  pointerEvents="none"
                  style={{
                    justifyContent: 'center',
                    margin: 15,
                  }}>
                  <TextInput
                    name="email"
                    style={Commonstyles.inputText}
                    placeholder="Search user"
                    placeholderTextColor={Font.greyText}
                    keyboardType="email-address"
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
              </TouchableOpacity>

              {/* Chat List */}
              <FlatListForChat
                ChatListArray={Parentconversation}
                navigation={Nav}
                OnlyView={'No'}
              />
            </View>
          ) : whoseChat === 'group' ? (
            <FlatListForGroupChat
              ChatListArray={groupconversation}
              navigation={Nav}
            />
          ) : (
            <FlatListForChat
              ChatListArray={conversation}
              navigation={Nav}
              OnlyView={'Yes'}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({});
