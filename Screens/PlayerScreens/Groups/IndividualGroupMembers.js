import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import font and design
import {Font, Commonstyles} from '../../Font/Font';
const IndividualGroupMembers = ({navigation, route}) => {
  const GroupArray = route.params?.groupArray;
  const [userToShow, setuserToShow] = useState(GroupArray.Members);
  return (
    <View style={{flex: 1, backgroundColor: Font.black}}>
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
          <Text style={Commonstyles.LogoWhite}>
            {GroupArray?.title}
            {'\n'}
            <Text style={Commonstyles.TextGrey}>Members</Text>
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
              navigation.navigate('PlayerNotification');
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={28}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Members area */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles.TextWhiteMembers}>Members</Text>
        {/* Search bar */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: 15,
            marginBottom: 15,
          }}>
          <TextInput
            name="email"
            style={Commonstyles.inputText}
            placeholder="Search user"
            placeholderTextColor={Font.greyText}
            onChangeText={text => {
              text = text.toLowerCase();
              setuserToShow(
                GroupArray?.Members.filter(data => {
                  var user = data.name.toLowerCase();
                  if (user.includes(text)) {
                    return data;
                  }
                }),
              );
            }}
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

        {/* UserList */}
        <FlatList
          data={userToShow}
          contentContainerStyle={{paddingBottom: 195}}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 25,
                }}>
                {/* Left Part */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={{
                      uri: item?.image,
                    }}
                    style={{
                      width: 49,
                      height: 49,

                      borderRadius: 90 / 2,
                    }}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={Commonstyles.TextWhiteMembersName}>
                      {item?.name}
                    </Text>
                  </View>
                </View>

                {/* Right Part */}
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      alert('Working on it');
                    }}>
                    <Entypo
                      name={'dots-three-horizontal'}
                      size={23}
                      color={Font.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default IndividualGroupMembers;

const styles = StyleSheet.create({});
