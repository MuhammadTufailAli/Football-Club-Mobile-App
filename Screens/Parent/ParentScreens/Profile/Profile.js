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
import CartProvider from '../../../ContextApi/contextApi';
import port from '../../../Port/Port';

import Loader from '../../../Loader/Loader';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

// import Image
import Football from '../../../../assets/Images/football.png';
const DEFAULT_IMAGE = Image.resolveAssetSource(Football).uri;
//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useIsFocused} from '@react-navigation/native';

const Profile = ({navigation}) => {
  const Nav = navigation;
  const isFocused = useIsFocused();
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cond, setCondition] = useState(true);
  const [sonData, setSonData] = useState([]);

  const DateJoined = moment(userdetails?.datedjoined)
    .utc()
    .format('MM/DD/YYYY');

  const getSonsData = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/users/singleUser/${userdetails?.refOfPlayer}`,
      );

      setSonData(result.data.data.doc);

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };
  useEffect(() => {
    getSonsData();
  }, [isFocused]);
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
              navigation.navigate('ParentNotification');
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={28}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View
        style={{
          borderColor: 'grey',
          borderBottomWidth: 0.5,
          paddingBottom: 30,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={{uri: userdetails?.image}}
            style={{
              width: 102,
              height: 102,

              borderRadius: 102 / 2,
              borderWidth: 5,
              borderColor: Font?.green,
              marginTop: 30,
              marginBottom: 20,
            }}
          />
          <Text style={Commonstyles?.TextWhiteFeatured}>
            {userdetails?.name}
          </Text>
          <Text style={Commonstyles?.TextGreysmall}>{userdetails?.email}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
            style={{
              flexDirection: 'row',
              marginTop: 15,
              width: 115,
              height: 30,
              backgroundColor: Font?.green,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 3,
            }}>
            <MaterialCommunityIcons
              name={'pencil'}
              size={13}
              style={{marginRight: 5}}
              color={Font.white}
            />
            <Text style={Commonstyles?.TextWhite12300}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Son ProfileArea */}
      {cond ? (
        <View style={{marginTop: -130}}>
          <Loader />
        </View>
      ) : (
        <View style={{margin: 15}}>
          <Text style={Commonstyles?.TextWhite}>Son's Profile</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SonProfile', {
                userdetails: sonData,
              });
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={Commonstyles?.TextGreysmall}>View Child Profile</Text>
            <AntDesign
              name={'right'}
              size={13}
              style={{marginRight: 5}}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Other Info */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles?.TextWhite}>Other information</Text>

        <View
          style={{marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome
            name={'user'}
            size={14}
            style={{marginRight: 10}}
            color={Font.white}
          />
          <Text style={Commonstyles?.TextGrey}>{userdetails?.role}</Text>
        </View>

        <View
          style={{marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome
            name={'phone'}
            size={14}
            style={{marginRight: 10}}
            color={Font.white}
          />
          <Text style={Commonstyles?.TextGrey}>{userdetails?.phone}</Text>
        </View>

        <View style={{marginTop: 10}}>
          <Text style={Commonstyles?.TextGrey}>
            Join Date <Text style={Commonstyles?.TextWhite}>{DateJoined}</Text>
          </Text>
        </View>
      </View>
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
