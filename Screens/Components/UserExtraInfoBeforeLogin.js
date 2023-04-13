import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  modal,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';

//importing icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//import font and design
import {Font, Commonstyles} from '../Font/Font';
import port from '../Port/Port';
import CartProvider from '../ContextApi/contextApi';

//Importing Image Picker
import ImagePicker from 'react-native-image-crop-picker';

//Importing DropDown
import DropDownPicker from 'react-native-dropdown-picker';

const UserExtraInfoBeforeLogin = () => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [height, setHeight] = useState('');
  const [DOB, setDOB] = useState(new Date());
  const [date, setDate] = useState('');
  var [userPhoto, setUserPhoto] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'GoalKeeper', value: 'GoalKeeper'},
    {label: 'Stricker', value: 'Stricker'},
    {label: 'Full-back', value: 'Full-back'},
    {label: 'Midfilder', value: 'Midfilder'},
    {label: 'Winger', value: 'Winger'},
  ]);

  const [open2, setOpen2] = useState(false);
  const [Gender, setGender] = useState('');
  const [items2, setItems2] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);

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
    console.log(DOB);
    const userData = {
      image: userPhoto,
      gender: Gender,
      height: height,
      dateOfBirth: DOB,
      position: value,
    };

    try {
      const result = await axios.patch(
        `${port.herokuPort}/users/updateUser/${userdetails?._id}`,
        userData,
      );

      setuserdetails(result.data.data);
    } catch (err) {
      console.log(err.response.data.message);
      alert('Error');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Font?.black}}>
      {/* Select date */}
      <DatePicker
        modal
        mode="date"
        open={openModal}
        date={DOB}
        onConfirm={date => {
          setDOB(date);
          setDate('Hello');
          setOpenModal(false);
        }}
        onCancel={() => {
          setOpenModal(false);
        }}
      />
      {/* Top Part */}
      <View style={{margin: 15}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <FontAwesome
            name={'user-circle-o'}
            size={25}
            color={Font.green}
            style={{marginRight: 10}}
          />
          <Text style={Commonstyles?.LogoWhite20}>Complete Your Profile</Text>
        </View>
        <Text style={Commonstyles?.TextGreyCalender}>
          Enter all the necessary data for approval.
        </Text>
      </View>
      {/* Upload Photo Area */}
      <View style={{marginTop: 15, alignItems: 'center'}}>
        {userPhoto === '' ? (
          <TouchableOpacity
            onPress={openImagePicker}
            style={{
              width: 131,
              height: 131,
              borderRadius: 131 / 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Font?.textFieldColor,
            }}>
            <FontAwesome name={'camera'} size={28} color={Font.green} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={openImagePicker}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: userPhoto,
              }}
              style={{
                width: 131,
                height: 131,
                borderRadius: 131 / 2,
              }}
            />
          </TouchableOpacity>
        )}

        <View style={{margin: 15}}>
          {userPhoto === '' ? (
            <Text style={Commonstyles?.TextGrey12300}>
              Image with transparent background will be preffered
            </Text>
          ) : (
            <View>
              <Text style={Commonstyles.UploadText}>
                Image Uploaded successfully
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Other input details */}
      <View>
        <View
          style={{
            flexDirection: 'row',

            zIndex: 100,
            marginLeft: 15,
            marginRight: 15,
            marginTop: 10,
            marginBottom: -18,
          }}>
          <View style={{flex: 1}}>
            <DropDownPicker
              style={{
                backgroundColor: Font.grey,
                height: 63,
              }}
              placeholderStyle={Commonstyles?.TextWhite12300}
              arrowIconStyle={{
                color: 'white',
              }}
              labelStyle={Commonstyles?.TextWhite12300}
              textStyle={Commonstyles?.TextWhite12300}
              dropDownContainerStyle={{
                backgroundColor: Font.grey,
              }}
              containerStyle={{
                width: 154,
                height: 80,
              }}
              maxHeight={80}
              placeholder="Gender"
              disableBorderRadius={true}
              showArrowIcon={true}
              showTickIcon={true}
              open={open2}
              value={Gender}
              items={items2}
              setOpen={setOpen2}
              setValue={setGender}
              setItems={setItems2}
            />
          </View>
          <View style={{flex: 1}}>
            <TextInput
              name="height"
              style={Commonstyles.inputText}
              placeholder="Height in ft"
              placeholderTextColor={Font.greyText}
              onChangeText={data => {
                setHeight(data);
              }}
              keyboardType={'numeric'}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setOpenModal(true);
          }}>
          <View pointerEvents="none">
            <View
              style={{
                justifyContent: 'center',
                marginLeft: 15,
                marginRight: 15,
                marginTop: 10,
              }}>
              <TextInput
                name="DOB"
                style={Commonstyles.inputText}
                placeholder="DOB"
                placeholderTextColor={Font.greyText}
                value={DOB}
              />
              <FontAwesome
                name={'calendar'}
                size={26}
                color={'white'}
                style={{
                  position: 'absolute',
                  right: 10,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            justifyContent: 'center',
            marginLeft: 15,
            marginRight: 15,
            marginTop: 10,
          }}>
          <DropDownPicker
            style={{
              backgroundColor: Font.grey,
              height: 63,
            }}
            placeholderStyle={Commonstyles?.TextWhite12300}
            labelStyle={Commonstyles?.TextWhite12300}
            textStyle={Commonstyles?.TextWhite12300}
            dropDownContainerStyle={{
              backgroundColor: Font.grey,
            }}
            containerProps={{
              style: {
                height: open ? 20 * (items.length + 1) : 80,
                width: '100%',
                borderRadius: 5,
              },
            }}
            placeholder="Position"
            disableBorderRadius={true}
            showArrowIcon={true}
            showTickIcon={true}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
        </View>
      </View>
      {/* Complete Button */}
      <View style={{marginLeft: 15, marginRight: 15}}>
        <TouchableOpacity
          style={Commonstyles.ButtonGreen}
          onPress={() => {
            if (
              height !== '' &&
              date !== '' &&
              value !== '' &&
              Gender !== '' &&
              userPhoto !== ''
            ) {
              UpdateUserInfo();
            } else {
              alert('Enter all fields');
            }
          }}>
          <Text style={Commonstyles.TextWhite}>Complete</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={{marginLeft: 15, marginRight: 15, marginTop: 15}}>
        <TouchableOpacity
          style={Commonstyles.ButtonGrey}
          onPress={async () => {
            const loggedIn = {
              isLoggedIn: false,
            };
            try {
              const result = await axios.patch(
                `${port.herokuPort}/users/updateUser/${userdetails?.id}`,
                loggedIn,
              );

              setuserdetails();
            } catch (err) {
              console.log(err);
            }
          }}>
          <Text style={Commonstyles.TextWhite}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserExtraInfoBeforeLogin;

const styles = StyleSheet.create({});
