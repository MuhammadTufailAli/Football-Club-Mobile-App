import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useState, useContext} from 'react';
import CartProvider from '../../ContextApi/contextApi';
import axios from 'axios';
import port from '../../Port/Port';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import font and design
import {Font, Commonstyles} from '../../Font/Font';

//importing Image picker
import ImagePicker from 'react-native-image-crop-picker';

const GroupAddPost = ({navigation, route}) => {
  const GroupArray = route.params?.groupArray;

  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [hide, setHide] = useState(false);

  //Image Picker to pick Video
  const openVideoPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
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

        setVideo(newfile);
      })
      .catch(e => console.log('error', e.message));
  };

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
        setImage(newUrl);

        //To stop user to post before image is uploaded
        setHide(false);
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

  //Posting newsfeed
  const PostNewsFeed = async () => {
    if (
      status.length === 0 &&
      image.length === 0 &&
      Object.keys(video).length === 0
    ) {
      alert('Please enter data');
    } else {
      const data = new FormData();
      data.append('status', status);
      data.append('refOfUser', userdetails?._id);
      data.append('refOfGroup', GroupArray?._id);
      data.append('image', image);

      if (Object.keys(video).length != 0) {
        data.append('file', video);
      }

      fetch(`${port.herokuPort}/newsfeed/PostNewsFeed`, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      })
        .then(response => {
          alert('Post added succesfully');
        })
        .catch(err => {
          console.log(err);
        });
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
          <Text style={Commonstyles.LogoWhite}>{GroupArray?.title}</Text>
        </View>
        {/* Notification icon */}
        <View
          style={{
            justifyContent: 'center',
            marginRight: 15,
          }}>
          <TouchableOpacity
            disabled={hide}
            style={{
              width: 76,
              height: 32,
              backgroundColor: hide ? Font.greyText : Font.green,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              PostNewsFeed();
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
              uri: userdetails?.image,
            }}
            style={{
              width: 34,
              height: 34,

              borderRadius: 90 / 2,
            }}
          />
          <View style={{marginLeft: 10}}>
            <Text style={Commonstyles.TextWhite}>
              {userdetails?.name}
              {'  '}
              {'\n'}
              <Text style={Commonstyles.TextGreysmallEmail}>
                {userdetails?.email}
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
            onChangeText={data => {
              setStatus(data);
            }}
          />
          {/* TO delete photo */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            style={{justifyContent: 'flex-end', margin: 0}}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'flex-end',
              }}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setHide(true);
                    openImagePicker();
                  }}>
                  <Text style={styles.modalText}>Add Other Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setImage('');
                    setModalVisible(false);
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 8,
                      marginBottom: 5,
                      fontSize: 18,
                      color: Font?.red,

                      fontFamily: 'Lexend-Regular',
                      fontWeight: '400',
                    }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {image.length !== 0 ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Image
                  source={{
                    uri: image,
                  }}
                  style={{
                    width: 120,
                    height: 120,

                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {/* Area to attach extra things */}
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => {
              setHide(true);
              openImagePicker();
            }}
            style={{
              flexDirection: 'row',
              backgroundColor: Font.grey,
              width: 150,
              height: 45,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Feather name={'image'} size={23} color={Font.green} />
            <Text style={styles.TextWhite}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openVideoPicker}
            style={{
              flexDirection: 'row',
              backgroundColor: Font.grey,
              width: 150,
              height: 45,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome name={'video-camera'} size={23} color={Font.green} />
            <Text style={styles.TextWhite}>Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default GroupAddPost;

const styles = StyleSheet.create({
  TextWhite: {
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  modalView: {
    width: '96%',
    height: '15%',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: Font.grey,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 18,
    color: Font.white,
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
    paddingBottom: 15,
    borderBottomWidth: 0.8,
    borderColor: 'grey',
  },
});
