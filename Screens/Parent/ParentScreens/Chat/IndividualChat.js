import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useRef} from 'react';
//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

// importing Screen
import Message from './Message';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const IndividualChat = ({navigation, route}) => {
  const UserInfo = route?.params?.userInfo;
  const scrollRef = useRef();
  const [messages, setmessages] = useState([
    {
      text: 'Hi',
      sender: 'Shaheer Ahmed',
      PhotoUrl: UserInfo?.ProfileUrl,
      time: '12:00',
    },

    {
      text: 'Hi',
      sender: 'Me',
      PhotoUrl: UserInfo?.ProfileUrl,
      time: '12:00',
    },
    {
      text: 'Kasa ho ap yaar',
      sender: 'Shaheer Ahmed',
      PhotoUrl: UserInfo?.ProfileUrl,
      time: '12:00',
    },
    {
      text: 'Fit kdfldkfaskdaskpdkaskdasldlasldlas;l',
      sender: 'Me',
      PhotoUrl: UserInfo?.ProfileUrl,
      time: '12:00',
    },
    {
      text: 'Ok',
      sender: 'Shaheer Ahmed',
      PhotoUrl: UserInfo?.ProfileUrl,
      time: '12:00',
    },
  ]);
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
          <Text style={Commonstyles.TextWhiteCalender}>
            {UserInfo?.Username}
            {'\n'}
            <Text style={Commonstyles.TextGrey12Light}>{UserInfo?.Email}</Text>
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
        <View style={{marginTop: 10}}>
          <ScrollView ref={scrollRef}>
            {messages.map(m => (
              <View>
                <Message message={m} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Sending Chat area */}
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 15,
            marginRight: 15,
          }}>
          <TextInput
            name="email"
            style={Commonstyles.inputText}
            placeholder="Enter Email"
            placeholderTextColor={Font.greyText}
            // value={values.email}
            // onChangeText={handleChange('email')}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
            }}>
            <MaterialCommunityIcons name={'send'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IndividualChat;

const styles = StyleSheet.create({});
