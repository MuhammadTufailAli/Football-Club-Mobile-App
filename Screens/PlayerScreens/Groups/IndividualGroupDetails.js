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
import {Font, Commonstyles} from '../../Font/Font';

const IndividualGroupDetails = ({navigation, route}) => {
  const GroupArray = route.params?.groupArray;
  const PostsInfo = route?.params?.GroupPostsInfo;
  var countImages = 0;
  var countVideos = 0;
  PostsInfo.map(data => {
    if (data?.image) {
      countImages++;
    }
    if (data?.video) {
      countVideos++;
    }
  });
  console.log('image', countImages, 'Video', countVideos);

  return (
    <View style={{flex: 1, backgroundColor: Font.grey}}>
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
            <Text style={Commonstyles.TextGrey}>Details</Text>
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

      {/* Details of group */}
      <View
        style={{
          flexDirection: 'row',
          margin: 15,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={Commonstyles.TextWhiteFeed}>Members</Text>
          <ScrollView horizontal={true} style={{marginTop: 20}}>
            {GroupArray?.Members.map(data => {
              return (
                <View>
                  <Image
                    source={{
                      uri: data?.image,
                    }}
                    style={{
                      width: 24,
                      height: 24,

                      borderRadius: 90 / 2,
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
          <View style={{marginTop: 30}}>
            <Text style={Commonstyles.TextWhiteFeed}>Activity</Text>
            <TouchableOpacity style={{flexDirection: 'row', marginTop: 15}}>
              <Feather name={'image'} size={23} color={Font.white} />
              <Text style={styles.TextWhite}>{countImages} Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection: 'row', marginTop: 15}}>
              <FontAwesome name={'video-camera'} size={23} color={Font.green} />
              <Text style={styles.TextWhite}>{countVideos} Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection: 'row', marginTop: 15}}>
              <MaterialCommunityIcons
                name={'post'}
                size={23}
                color={Font.greyText}
              />
              <Text style={styles.TextWhite}>{PostsInfo.length} Posts</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('IndividualGroupMembers', {
                groupArray: GroupArray,
              });
            }}>
            <Text style={Commonstyles.TextWhitesmallmini}>See all</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default IndividualGroupDetails;

const styles = StyleSheet.create({
  TextWhite: {
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
