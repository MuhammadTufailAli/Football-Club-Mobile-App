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
import Loader from '../../Loader/Loader';
import {Font} from '../../font/Font';

function Conversation({conversation, currentUser, AllUsers}) {
  const [user, setUser] = useState(null);
  const {userdetails, setuserdetails, token} = useContext(CartProvider);

  const getfriends = async friendId => {
    setUser(AllUsers.filter(user => user._id === friendId));
    // try {
    //   const result = await axios.get(
    //     `http://10.0.2.2:3000/users/singleUser/${friendId}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     },
    //   );

    //   setUser(result.data.data.doc);
    // } catch (err) {
    //   console.log(err.response.data);
    //   // alert(err.response.data);
    // }
    // axios
    //   .get(`http://10.0.2.2:3000/users/singleUser/${friendId}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then(res => {
    //     console.log(res.data.data.doc);
    //     setUser(res.data.data.doc);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  useEffect(() => {
    var friendId = conversation.members.find(m => m !== currentUser);

    getfriends(friendId);
  }, []);
  if (!user) {
    return <View></View>;
  } else {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderColor: 'grey',
            paddingBottom: 5,
          }}>
          <Image
            source={{
              uri: user[0]?.photoUrl,
            }}
            style={{
              width: 60,
              height: 60,

              borderRadius: 90 / 2,
            }}
          />
          <View>
            <Text
              style={{
                marginTop: 5,
                marginLeft: 5,
                fontWeight: 'bold',
                fontSize: 18,
                color: Font.TextColor,
                fontFamily: 'Lexend-Regular',
              }}>
              {user[0]?.firstname} {user[0]?.lastname}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                marginLeft: 5,
                color: 'grey',
                fontSize: 14,
                fontFamily: 'Lexend-Regular',
                fontWeight: '400',
              }}>
              Message:{' '}
              {conversation?.lastMessage?.length < 33
                ? `${conversation?.lastMessage}`
                : `${conversation?.lastMessage.substring(0, 33)}...`}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Conversation;
