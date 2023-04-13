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
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../../../ContextApi/contextApi';
import port from '../../../Port/Port';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//Importing Image Picker
import ImagePicker from 'react-native-image-crop-picker';

//Importing DropDown
import DropDownPicker from 'react-native-dropdown-picker';

const EditProfile = ({navigation, route}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const phoneNumber = userdetails?.phone.toString();

  const [name, setName] = useState(userdetails?.name);
  const [phone, setPhone] = useState(userdetails?.phone.toString());

  var [userPhoto, setUserPhoto] = useState(userdetails?.image);

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
        setUserPhoto(newUrl);
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

  //Update User info
  const UpdateUserInfo = async () => {
    const Phone = parseInt(phone);

    const userData = {
      image: userPhoto,

      name: name,
      phone: Phone,
    };

    try {
      const result = await axios.patch(
        `${port.herokuPort}/users/updateUser/${userdetails?._id}`,
        userData,
      );

      setuserdetails(result.data.data);
      navigation.goBack();
    } catch (err) {
      console.log(err.response.data.message);
      alert('Error');
    }
  };
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
          <Text style={Commonstyles.LogoWhite}>
            Editing Profile{'\n'}
            <Text style={Commonstyles.TextGrey}>Information</Text>
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

      {/* Profile Photo */}
      <View style={{width: '100%', zIndex: 100}}>
        <ImageBackground
          source={{
            uri: userPhoto,
          }}
          resizeMode="cover"
          style={{width: '100%', height: 358}}>
          <View style={{justifyContent: 'space-between', flex: 1}}>
            {/* Top Area */}
            <View
              style={{
                margin: 15,
              }}>
              {/* Name Area */}
              <View>
                <TouchableOpacity
                  onPress={openImagePicker}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <AntDesign
                    name={'camera'}
                    size={25}
                    color={Font.white}
                    style={{marginRight: 8}}
                  />
                  <Text style={Commonstyles.TextWhite12}>Upload Picture</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* OtherInfo */}
      <View
        style={{
          marginTop: 15,
          marginBottom: 100,

          borderRadius: 18,
          backgroundColor: Font.black,
        }}>
        {/* About Heading */}
        <View
          style={{
            padding: 6,
            paddingLeft: 15,
            borderBottomWidth: 1,
            borderColor: '#3E3E3E',
          }}>
          <Text style={Commonstyles?.TextWhitesmall}>Other</Text>
        </View>
        {/* Other Information Fields */}
        <View style={{marginTop: 20}}>
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 15,
              marginRight: 15,
            }}>
            <TextInput
              name="email"
              style={Commonstyles.inputText}
              placeholder={userdetails?.name}
              placeholderTextColor={Font.greyText}
              onChangeText={data => {
                setName(data);
              }}
              keyboardType="email-address"
            />
            <FontAwesome
              name={'user-circle-o'}
              size={26}
              color={'white'}
              style={{
                position: 'absolute',
                right: 10,
              }}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 15,
              marginRight: 15,
              marginTop: 10,
            }}>
            <TextInput
              name="phone"
              maxLength={10}
              style={Commonstyles.inputText}
              placeholder={phoneNumber}
              placeholderTextColor={Font.greyText}
              keyboardType={'phone-pad'}
              onChangeText={data => {
                setPhone(data);
              }}
            />
            <FontAwesome
              name={'phone-square'}
              size={26}
              color={'white'}
              style={{
                position: 'absolute',
                right: 10,
              }}
            />
          </View>

          {/* Update Button */}
          <View style={{marginTop: 20, marginLeft: 15, marginRight: 15}}>
            <TouchableOpacity
              style={Commonstyles.ButtonGreen}
              onPress={() => {
                UpdateUserInfo();
              }}>
              <Text style={Commonstyles.TextWhite}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: '#dadae8',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 0,
    color: Font.TextColor,
  },
});
