import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import moment from 'moment';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../../ContextApi/contextApi';
import port from '../../Port/Port';

import Loader from '../../Loader/Loader';

//importing Flatlist
import UserPostList from '../../Components/FlatListForFeed';
//import font and design
import {Font, Commonstyles} from '../../Font/Font';

// import Image
import Football from '../../../assets/Images/football.png';
const DEFAULT_IMAGE = Image.resolveAssetSource(Football).uri;
//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useIsFocused} from '@react-navigation/native';

const Profile = ({navigation}) => {
  const Nav = navigation;
  const isFocused = useIsFocused();
  var Currentyear = new Date().getFullYear();

  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cond, setCondition] = useState(true);
  const [feedArrayFromBackend, setFeedArrayFromBackend] = useState([]);
  const DateBirth = moment(userdetails?.dateOfBirth).utc().format('MM/DD/YYYY');
  var BirthYearString = DateBirth.substr(DateBirth.length - 4);
  var BirthYear = parseInt(BirthYearString);
  const age = Currentyear - BirthYear;
  const [getDataCondition, setDataCondition] = useState(false);

  //getting newsfeed from backend
  const getNewsFeed = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/newsfeed/GetAllNewsFeed`,
      );

      setFeedArrayFromBackend(result.data.data);

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  useEffect(() => {
    getNewsFeed();
  }, [isFocused, getDataCondition]);
  return (
    <ScrollView style={{flex: 1, backgroundColor: Font.black}}>
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
          <Text style={Commonstyles.LogoWhite}>My Profile</Text>
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

      {/* Profile Photo */}
      <View style={{width: '100%', height: 358}}>
        <ImageBackground
          source={{
            uri: userdetails?.image,
          }}
          resizeMode="cover"
          style={{width: '100%', height: 358}}>
          <View style={{justifyContent: 'space-between', flex: 1}}>
            {/* Top Area */}
            <View
              style={{
                margin: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {/* Name Area */}
              <View>
                <Text style={Commonstyles?.TextWhiteMembersBold}>
                  {userdetails?.name}
                </Text>
              </View>
              {/* Edit Area */}
              <View
                style={{
                  backgroundColor: Font.green,
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 90 / 2,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('EditProfile', {
                      userDetails: userdetails,
                    });
                  }}>
                  <MaterialCommunityIcons
                    name={'pencil'}
                    size={14}
                    color={Font.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Bottom Area */}
            <View style={{margin: 15}}>
              {/* Carrier */}
              <View style={{flexDirection: 'row'}}>
                <Ionicons name={'shirt-outline'} size={25} color={Font.green} />
                <Ionicons
                  name={'football-outline'}
                  size={13}
                  color={Font.green}
                  style={{
                    alignSelf: 'flex-end',
                    marginLeft: -11,
                    marginRight: 10,
                  }}
                />
                <View style={{justifyContent: 'flex-end'}}>
                  <Text style={Commonstyles?.TextGreysmall}>
                    {userdetails?.position}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={styles.UserDetailView}>
                  <View style={styles.CarreirViewHeading}>
                    <Text style={Commonstyles?.TextGreensmall}>Age</Text>
                  </View>
                  <View style={styles.CarreirViewInfo}>
                    <Text style={Commonstyles?.LogoWhite20}>{age}</Text>
                  </View>
                </View>
                <View style={styles.UserDetailView}>
                  <View style={styles.CarreirViewHeading}>
                    <Text style={Commonstyles?.TextGreensmall}>Avg</Text>
                  </View>
                  <View style={styles.CarreirViewInfo}>
                    {userdetails?.avgScore ? (
                      <Text style={Commonstyles?.LogoWhite20}>
                        {userDetails?.Avg}
                      </Text>
                    ) : (
                      <Text style={Commonstyles?.LogoWhite20}>-</Text>
                    )}
                  </View>
                </View>
                <View style={styles.UserDetailView}>
                  <View style={styles.CarreirViewHeading}>
                    <Text style={Commonstyles?.TextGreensmall}>Height</Text>
                  </View>
                  <View style={styles.CarreirViewInfo}>
                    <Text style={Commonstyles?.LogoWhite20}>
                      {userdetails?.height}
                      <Text style={Commonstyles?.TextWhiteCalender}>ft</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* About View */}
      <View
        style={{
          height: 183,

          borderRadius: 18,
          backgroundColor: Font.grey2,
        }}>
        {/* About Heading */}
        <View
          style={{
            padding: 6,
            paddingLeft: 15,
            borderBottomWidth: 1,
            borderColor: '#3E3E3E',
          }}>
          <Text style={Commonstyles?.TextWhitesmall}>About</Text>
        </View>
        {/* Information */}
        <View style={{flexDirection: 'row', flex: 1}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',

              justifyContent: 'center',
            }}>
            <Image
              source={{uri: DEFAULT_IMAGE}}
              style={{
                width: 210,
                height: 127,

                borderRadius: 20,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{marginLeft: 10, marginRight: 12}}>
                <Text style={Commonstyles?.TextGreysmallmini}>Full name</Text>
                <Text style={Commonstyles?.TextWhite12}>
                  {userdetails?.name}
                </Text>
              </View>
              <View>
                <Text style={Commonstyles?.TextGreysmallmini}>Phone</Text>
                <Text style={Commonstyles?.TextWhite12}>
                  {userdetails?.phone}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{marginLeft: 10, marginRight: 12}}>
                <Text style={Commonstyles?.TextGreysmallmini}>DOB</Text>
                <Text style={Commonstyles?.TextWhite12}>{DateBirth}</Text>
              </View>
              <View>
                <Text style={Commonstyles?.TextGreysmallmini}>Gender</Text>
                <Text style={Commonstyles?.TextWhite12}>
                  {userdetails?.gender}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Post thing */}
      <View
        style={{
          backgroundColor: Font.grey,
          paddingBottom: 20,
          marginBottom: 10,
          marginTop: 15,
          borderRadius: 18,
        }}>
        <View
          style={{
            flexDirection: 'row',
            margin: 15,

            alignItems: 'center',
          }}>
          <Image
            source={{
              uri: userdetails?.image,
            }}
            style={{
              width: 30,
              height: 30,

              borderRadius: 90 / 2,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProfileAddPost', {
                userdata: userdetails,
              });
            }}
            style={{
              marginLeft: 10,
              width: '90%',
              marginRight: 15,
            }}>
            <View pointerEvents="none">
              <TextInput
                name="password"
                secureTextEntry={true}
                style={Commonstyles.TextInput}
                placeholder="Post Something"
                placeholderTextColor={Font.TextGrey}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 15,
            marginRight: 15,
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              navigation.navigate('ProfileAddPost', {
                userdata: userdetails,
              });
            }}>
            <Feather name={'image'} size={23} color={Font.white} />
            <Text style={styles.TextWhite}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              navigation.navigate('ProfileAddPost', {
                userdata: userdetails,
              });
            }}>
            <FontAwesome name={'video-camera'} size={23} color={Font.green} />
            <Text style={styles.TextWhite}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              navigation.navigate('ProfileAddPost', {
                userdata: userdetails,
              });
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
      {/* FlatList to show the UserPosts */}
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <UserPostList
          FeedArray={feedArrayFromBackend}
          setDataCondition={setDataCondition}
          getDataCondition={getDataCondition}
          navigation={Nav}
        />
      )}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  UserDetailView: {
    width: 84,
    height: 84,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: Font.grey2,
    borderWidth: 1,
    borderColor: '#3E3E3E',
    justifyContent: 'space-between',
  },
  CarreirViewHeading: {marginLeft: 10, marginTop: 3},
  CarreirViewInfo: {
    alignItems: 'flex-end',
    margin: 10,
  },
  TextWhite: {
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
