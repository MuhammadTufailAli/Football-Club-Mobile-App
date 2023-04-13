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

// importing Screen
import GroupMessage from './GroupMessage';

//importing Image picker
import ImagePicker from 'react-native-image-crop-picker';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const ChatScreenGroup = ({navigation, route}) => {
  var currentChat = route.params?.currentChat;
  var From = route.params?.from;
  //   var OnlyView = route.params?.OnlyView;

  const {userdetails, setuserdetails, token, socket} = useContext(CartProvider);
  const [messages, setMessages] = useState(route.params?.currentChat?.messages);
  const [singleMessage, setSingleMessage] = useState();
  const [receiverUser, setreceiverUser] = useState();
  const [receiverId, setreceiverId] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [lastMessage, setLastMessage] = useState('');
  const [condition, setcondition] = useState(true);
  const [condition2, setcondition2] = useState(true);

  const [image, setImage] = useState('');

  //Uploading Photo to cloudnary
  const handleUploadFront = async image => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'MuhammadTufailAli'),
      data.append('cloud_name', 'vehiclebuddy');

    fetch('https://api.cloudinary.com/v1_1/vehiclebuddy/image/upload', {
      method: 'post',
      body: data,
    })
      .then(res => res.json())
      .then(data => {
        var newUrl = data.url.slice(0, 4) + 's' + data.url.slice(4);
        console.log(newUrl);
        setImage(newUrl);
      });
  };
  //Image picker to pickimage
  const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      compressImageQuality: 0.8,
      maxFiles: 10,
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(response => {
        let imageList = {
          filename: response.filename,
          path: response.path,
          data: response.data,
        };

        var prefix = Math.random();
        let newfile = {
          uri: imageList.path,
          type: `${prefix}/${imageList.path.split('.')[2]}`,
          name: `${prefix}.${imageList.path.split('.')[2]}`,
        };

        handleUploadFront(newfile);
      })
      .catch(e => console.log('error', e.message));
  };

  const scrollRef = useRef();

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
          <Text style={Commonstyles.TextWhiteProfileUserName}>
            {route.params?.currentChat?.name}
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
              alert('Coming Soon');
            }}>
            <Entypo
              name={'dots-three-horizontal'}
              size={23}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Chat and send chat area */}
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: 75,
        }}>
        <View style={{marginTop: 10, flex: 8}}>
          <ScrollView ref={scrollRef}>
            {messages.map(m => (
              <View>
                <GroupMessage message={m} />
              </View>
            ))}
          </ScrollView>
        </View>
        {userdetails?.role === 'Player' ? (
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 15,
              marginRight: 15,
              fles: 2,
            }}>
            {/* Sending Chat area */}

            <TextInput
              style={Commonstyles.inputText}
              placeholder="Send Message"
              placeholderTextColor={Font.greyText}
              value={
                image.length === 0
                  ? singleMessage
                  : 'Image selected Successfully'
              }
              onChangeText={setSingleMessage}
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  openImagePicker();
                }}
                style={{marginRight: 10}}>
                <Entypo name={'link'} size={20} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (image.length === 0) {
                    var message = {
                      sender: userdetails._id,
                      content: singleMessage,
                    };
                  } else {
                    var message = {
                      sender: userdetails._id,
                      content: image,
                    };
                  }

                  //Sending Message to data base
                  axios
                    .post(
                      `${port.herokuPort}/groupconversation/send/${route.params?.currentChat?._id}`,
                      message,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    )
                    .then(res => {
                      const date = new Date();
                      if (image.length === 0) {
                        var newMessage = {
                          sender: userdetails._id,
                          content: singleMessage,
                          timestamp: date,
                        };
                      } else {
                        var newMessage = {
                          sender: userdetails._id,
                          content: image,
                          timestamp: date,
                        };
                      }

                      setMessages([...messages, newMessage]);

                      setSingleMessage('');
                      setImage('');
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }}>
                <MaterialCommunityIcons
                  name={'send'}
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
  //   }
};

export default ChatScreenGroup;

const styles = StyleSheet.create({});
