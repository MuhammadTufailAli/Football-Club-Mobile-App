import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SectionList,
} from 'react-native';
import React, {useState, useContext} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Font, Commonstyles} from '../font/Font';
import CartProvider from '../ContextApi/contextApi';
import axios from 'axios';
import port from '../Port/Port';
const SearchUser = ({navigation, route}) => {
  const {userdetails, setuserdetails, token, socket} = useContext(CartProvider);
  const [totalData, setTotalData] = useState(route.params?.users);
  const [dataToshow, setdataToshow] = useState(route.params?.users);

  const findConversation = async otherUser => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/conversation/find/${userdetails._id}/${otherUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (result.data.data) {
        navigation.navigate('ChatScreen', {currentChat: result.data.data});
      } else {
        const userDetails = {
          senderId: userdetails._id,
          receiverId: otherUser,
        };
        try {
          const result = await axios.post(
            `${port.herokuPort}/conversation`,
            userDetails,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          navigation.navigate('ChatScreen', {currentChat: result.data});
        } catch (err) {
          console.log(err);
          alert('Error');
        }
      }
    } catch (err) {
      console.log(err);
      alert('Error');
    }
    // axios
    //   .get(
    //     `http://10.0.2.2:3000/conversation/find/${userdetails._id}/${otherUser}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     },
    //   )
    //   .then(res => {
    //     if (res.data.data) {
    //       navigation.navigate('ChatScreen', {currentChat: res.data.data});
    //     } else {
    //       const userDetails = {
    //         senderId: userdetails._id,
    //         receiverId: otherUser,
    //       };
    //       axios
    //         .post('http://10.0.2.2:3000/conversation', userDetails, {
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         })
    //         .then(res => {
    //           navigation.navigate('ChatScreen', {currentChat: res.data});
    //         })
    //         .catch(err => {
    //           // setauthCondition(false);
    //           console.log(err);
    //         });
    //     }
    //   })
    //   .catch(err => {
    //     // setauthCondition(false);
    //     console.log(err);
    //   });
  };
  return (
    <View style={{flex: 1}}>
      {/* Top Bar */}
      <View
        style={{
          flex: 0.8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Font.ButtonColor,
          height: 60,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            style={{textAlign: 'left', marginLeft: 5}}
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name={'left'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Search User</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{marginRight: 8, color: 'white'}}> </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Search Area */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          marginBottom: 5,
          flex: 0.8,
        }}>
        <AntDesign
          name={'search1'}
          size={20}
          color={'grey'}
          style={{alignSelf: 'center', marginLeft: 10, marginRight: 5}}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={Font.placeholder}
          style={{
            padding: 6,
            borderWidth: 1,
            borderRadius: 10,
            flex: 0.97,
            backgroundColor: 'rgba(235, 238, 242, 255)',
          }}
          onChangeText={text => {
            text = text.toLowerCase();
            setdataToshow(
              totalData.filter(obj => {
                var fullname =
                  obj.firstname.toLowerCase() +
                  ' ' +
                  obj.lastname.toLowerCase();
                console.log(fullname);
                if (fullname.includes(text)) {
                  return obj;
                }
              }),
            );
          }}
        />
      </View>

      {/* User List */}
      <View style={{marginLeft: 10, marginTop: 10, flex: 11}}>
        <FlatList
          data={dataToshow}
          initialNumToRender={10}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 8,

                  borderBottomWidth: 0.5,
                  borderColor: 'grey',
                  paddingBottom: 4,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    findConversation(item._id);
                  }}>
                  <Image
                    source={{
                      uri: item.photoUrl,
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
                    {item.firstname} {item.lastname}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default SearchUser;

const styles = StyleSheet.create({
  text: {
    color: 'white',

    fontSize: 18,
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
});
