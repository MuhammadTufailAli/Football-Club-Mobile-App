import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {io} from 'socket.io-client';
import CartProvider from '../ContextApi/contextApi';
import Message from './message/Message';
import Lottie from 'lottie-react-native';
import port from '../Port/Port';
import {Font, Commonstyles} from '../font/Font';

const ChatScreen = ({navigation, route}) => {
  var currentChat = route.params?.currentChat;

  const {userdetails, setuserdetails, token, socket} = useContext(CartProvider);
  const [messages, setMessages] = useState([]);
  const [singleMessage, setSingleMessage] = useState();
  const [receiverUser, setreceiverUser] = useState();
  const [receiverId, setreceiverId] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [lastMessage, setLastMessage] = useState('');
  const [condition, setcondition] = useState(true);
  const [condition2, setcondition2] = useState(true);

  const scrollRef = useRef();

  //Get All the messages
  const getMessages = async () => {
    const otherUserId = currentChat?.members.filter(
      user => user !== userdetails._id,
    );

    setreceiverId(otherUserId[0]);

    try {
      const result = await axios.get(
        `${port.herokuPort}/message/${currentChat?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages(result.data);
    } catch (err) {
      console.log(err.response.data);
      alert(err.response.data);
    }

    try {
      const result = await axios.get(
        `${port.herokuPort}/users/singleUser/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setreceiverUser(result.data.data.doc);
      setcondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert(err.response.data);
    }
  };

  //To automatically scroll the scroll bar
  useEffect(() => {
    console.log('Hello');
    scrollRef.current?.scrollToEnd({
      animated: true,
    });
  }, [messages]);

  useEffect(() => {
    //To recieve message which was send by user to server and server again send to receiver
    socket.current.on('getMessage', data => {
      console.log(data.text);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //If there is change in arrival message then we will update our messages
  useEffect(() => {
    //currentChat?.members.includes(arrivalMessage.sender) is ka mtlb k jisa send kiya ha message sirf usa receive ho

    setLastMessage(arrivalMessage?.text);
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    getMessages();
  }, []);
  if (condition) {
    return (
      <View style={{alignItems: 'center'}}>
        <Lottie
          style={{
            marginTop: 10,
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
            marginTop: -20,
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 10,
            color: Font.LabelColor,
            fontFamily: 'Lexend-Regular',
          }}>
          Searching conversation for you
        </Text>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {currentChat ? (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                backgroundColor: 'white',
                borderBottomWidth: 0.3,
                borderColor: Font.LightColor,
              }}>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => {
                  navigation.goBack();
                }}>
                <AntDesign name={'left'} size={20} color={'#ad02ad'} />
              </TouchableOpacity>
              <Image
                source={{
                  uri: receiverUser.photoUrl,
                }}
                style={{
                  width: 32,
                  height: 32,
                  alignSelf: 'center',
                  borderRadius: 90 / 2,
                  marginLeft: 10,
                }}
              />
              <View>
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    color: Font.TextColor,
                    marginLeft: 5,
                    fontFamily: 'Lexend-Regular',
                  }}>
                  {' '}
                  {receiverUser?.firstname} {receiverUser?.lastname}
                </Text>
                <Text
                  style={{
                    marginTop: -5,
                    marginLeft: 4,
                    color: Font.LightColor,
                    marginLeft: 8,
                    fontFamily: 'Lexend-Regular',
                    fontWeight: '400',
                  }}>
                  {receiverUser?.role}
                </Text>
              </View>
            </View>
            <View style={{flex: 3}}>
              <ScrollView ref={scrollRef}>
                {messages.map(m => (
                  <View>
                    <Message
                      message={m}
                      own={m.sender === userdetails._id}
                      otherUser={receiverUser}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flex: 0,
                flexDirection: 'row',
              }}>
              <TextInput
                style={styles.input}
                onChangeText={setSingleMessage}
                placeholderTextColor={Font.LightColor}
                placeholder="Enter message"
                value={singleMessage}
              />
              <TouchableOpacity
                style={{alignSelf: 'center', marginLeft: -10}}
                onPress={() => {
                  setcondition2(!condition2);
                  const message = {
                    sender: userdetails._id,
                    text: singleMessage,
                    conversationId: currentChat._id,
                  };

                  console.log('THE RECEIVER ID ISSS', receiverId);

                  socket.current.emit('sendMessage', {
                    senderId: userdetails._id,
                    receiverId,
                    text: singleMessage,
                  });

                  axios
                    .post(`${port.herokuPort}/message`, message, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    })
                    .then(res => {
                      setMessages([...messages, res.data]);
                      setSingleMessage('');
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }}>
                <MaterialCommunityIcons
                  name={'send-circle'}
                  size={40}
                  color={'#ad02ad'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text>Open a conversation to start a chat</Text>
        )}
      </View>
    );
  }
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.6,
    borderRadius: 25,
    padding: 10,
    width: '86%',
    alignSelf: 'center',
    color: Font.TextColor,
  },
});

export default ChatScreen;
