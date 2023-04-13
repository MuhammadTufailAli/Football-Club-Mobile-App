import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import CartProvider from '../ContextApi/contextApi';
import Conversation from './conversation/Conversation';

import port from '../Port/Port';
import {Font, Commonstyles} from '../font/Font';
import Lottie from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Messenger = ({navigation}) => {
  const {userdetails, setuserdetails, token, socket, onlineUsers} =
    useContext(CartProvider);
  const isFocused = useIsFocused();

  const [conversation, setConversation] = useState([]);
  const [lastMessage, setLastMessage] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [allUsers, setAllusers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
  const [condition, setCondition] = useState(true);

  //To get online users
  // useEffect(() => {
  //   socket.current.on('getUsers', users => {

  //     setOnlineUsers(users);
  //   });
  // }, [conversation]);

  //Getting All the conversation of User
  const getConversation = async () => {
    try {
      const result = await axios.get(`${port.herokuPort}/users/allUsers`);

      setAllusers(
        result.data.data.doc.filter(item => item.email != userdetails.email),
      );
    } catch (err) {
      console.log(err.response.data);
      alert(err.response.data);
    }

    try {
      const result = await axios.get(`${port.herokuPort}/conversation`);

      setCondition(false);

      setConversation(result.data.data);
    } catch (err) {
      console.log(err.response.message);
      alert('Error');
    }
  };

  useEffect(() => {
    isFocused && getConversation();
  }, [isFocused]);

  return (
    // Top Level View
    <View style={{flex: 1}}>
      {/* View for Top bar */}
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 5,

          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 0.8,
          backgroundColor: Font.ButtonColor,
        }}>
        <TouchableOpacity
          style={{marginLeft: 5}}
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name={'left'} size={20} color={'white'} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
            fontSize: 18,
            fontFamily: 'Lexend-Regular',
          }}>
          Chats
        </Text>
        <Image
          source={{
            uri: userdetails.photoUrl,
          }}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,

            // float: 'left',

            borderRadius: 90 / 2,
          }}
        />
      </View>

      {/* View for search bar */}
      <View
        style={{
          marginTop: 5,
          marginBottom: 5,
          flex: 0.9,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => {
            navigation.navigate('SearchUser', {users: allUsers});
          }}>
          <AntDesign
            name={'search1'}
            size={20}
            color={'grey'}
            style={{alignSelf: 'center', marginLeft: 5, marginRight: 5}}
          />
          <View pointerEvents="none">
            <View style={{flexDirection: 'row'}}>
              <TextInput
                placeholder="Search"
                placeholderTextColor={Font.placeholder}
                style={{
                  padding: 6,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '95%',
                  backgroundColor: 'rgba(235, 238, 242, 255)',
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* View for Online users */}

      <View style={{flex: 1.49, marginTop: 0}}>
        <ChatOnline onlineUsers={onlineUsers} navigation={navigation} />
      </View>

      {condition ? (
        <View style={{flex: 8, alignItems: 'center'}}>
          <Lottie
            style={{
              marginTop: -50,
              width: 440,
              height: 500,
              alignSelf: 'center',
            }}
            source={require('../../assets/searching.json')}
            autoPlay
            loop
          />
          <Text
            style={{
              marginTop: -90,
              fontSize: 16,
              fontWeight: '700',
              marginLeft: 10,
              color: Font.LabelColor,
              fontFamily: 'Lexend-Regular',
            }}>
            Searching conversation for you
          </Text>
        </View>
      ) : Object.keys(conversation).length === 0 ? (
        <View style={{flex: 8, alignItems: 'center'}}>
          <Lottie
            style={{
              marginTop: -10,
              width: 350,
              height: 410,
              alignSelf: 'center',
            }}
            source={require('../../assets/Not Found.json')}
            autoPlay
            loop
          />
          <Text
            style={{
              marginTop: -100,
              fontSize: 20,
              fontWeight: '700',
              marginLeft: 10,
              color: Font.LabelColor,
              fontFamily: 'Lexend-Regular',
            }}>
            No Conversation Found :(
          </Text>
          <View>
            <TouchableOpacity
              style={{marginLeft: 280}}
              onPress={() => {
                navigation.navigate('SearchUser', {users: allUsers});
              }}>
              <Lottie
                style={{
                  width: 140,
                  height: 100,
                  alignSelf: 'center',
                }}
                source={require('../../assets/NewConversation.json')}
                autoPlay
                loop
              />
              <Text
                style={{
                  alignSelf: 'center',
                  marginTop: -30,
                  fontSize: 14,
                  fontFamily: 'Lexend-Regular',
                  fontWeight: '400',

                  color: Font.LabelColor,
                }}>
                New Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{alignItems: 'center', flex: 8}}>
          <ScrollView style={{width: '92%'}}>
            {conversation.map(c => {
              return (
                <View style={{marginLeft: 5, marginTop: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ChatScreen', {currentChat: c});
                    }}>
                    <Conversation
                      conversation={c}
                      currentUser={userdetails._id}
                      AllUsers={allUsers}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
      {/* View for conversations */}
      {/* {} */}
    </View>
  );
};

export default Messenger;

const styles = StyleSheet.create({
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },

  itemText: {
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
});
