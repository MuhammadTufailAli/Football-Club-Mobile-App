import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

const ProfileAddPost = ({navigation, route}) => {
  const userDetails = route.params?.userdata;
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
            {userDetails?.FirstName} {userDetails?.LastName}
          </Text>
        </View>
        {/* Notification icon */}
        <View
          style={{
            justifyContent: 'center',
            marginRight: 15,
          }}>
          <TouchableOpacity
            style={{
              width: 76,
              height: 32,
              backgroundColor: Font.green,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              alert('Post will be posted from here');
            }}>
            <Text style={Commonstyles.TextWhitesmall}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Area for Post */}
      <View
        style={{
          margin: 15,
          borderBottomWidth: 0.5,
          borderColor: Font.greyText,
          paddingBottom: 25,
        }}>
        {/* User Info */}

        <View style={{flexDirection: 'row'}}>
          <Image
            source={{
              uri: 'https://images.squarespace-cdn.com/content/v1/5cf0d08d5fc69d000172462a/1599805610146-J0G5GMGFBXVWND4Z71UK/Aleem+Business+Headshot+for+LinkedIn+Profile.jpg',
            }}
            style={{
              width: 34,
              height: 34,

              borderRadius: 90 / 2,
            }}
          />
          <View style={{marginLeft: 10}}>
            <Text style={Commonstyles.TextWhite}>
              {userDetails?.FirstName} {userDetails?.LastName}
              {'  '}
              {'\n'}
              <Text style={Commonstyles.TextGreysmallEmail}>
                {userDetails?.Email}
              </Text>
            </Text>
          </View>
        </View>

        {/* TextArea to write status */}
        <View style={{marginTop: 20}}>
          <TextInput
            name="status"
            multiline={true}
            style={Commonstyles.inputTextForPost}
            placeholder="Write Something to post"
            placeholderTextColor={Font.greyText}
          />
        </View>
        {/* Area to attach extra things */}
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: Font.grey,
              width: 100,
              height: 45,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Feather name={'image'} size={23} color={Font.green} />
            <Text style={styles.TextWhite}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: Font.grey,
              width: 100,
              height: 45,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome name={'video-camera'} size={23} color={Font.green} />
            <Text style={styles.TextWhite}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: Font.grey,
              width: 100,
              height: 45,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name={'file-gif-box'}
              size={23}
              color={Font.green}
            />
            <Text style={styles.TextWhite}>GIF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileAddPost;

const styles = StyleSheet.create({
  TextWhite: {
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
