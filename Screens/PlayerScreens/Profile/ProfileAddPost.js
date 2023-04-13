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
  Modal,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../../ContextApi/contextApi';
import port from '../../Port/Port';

import Loader from '../../Loader/Loader';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

//import font and design
import {Font, Commonstyles} from '../../Font/Font';

//importing Image picker
import ImagePicker from 'react-native-image-crop-picker';

const ProfileAddPost = ({navigation, route}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);

  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [hide, setHide] = useState(false);
  const [groupArrayFromBackend, setGroupArrayFromBackend] = useState([]);
  const [groupArrayToShow, setGroupArrayToShow] = useState([]);
  const [groupId, setGroupId] = useState('');

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
      setGroupModal(true);
    }
  };

  //sharing post in group
  const sharePostInGroup = async () => {
    const data = new FormData();
    data.append('status', status);
    data.append('refOfUser', userdetails?._id);
    data.append('refOfGroup', groupId);
    data.append('image', image);
    console.log(Object.keys(video).length);
    if (Object.keys(video).length != 0) {
      data.append('file', video);
    }

    console.log(data);

    fetch(`${port.herokuPort}/newsfeed/PostNewsFeed`, {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then(response => {
        alert('Post added succesfully');
        setGroupModal(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  //Get groups in which player is member
  const getGroups = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/group/GetAllPlayerGroups/${userdetails?._id}`,
      );

      setGroupArrayFromBackend(result.data.data);
      setGroupArrayToShow(result.data.data);

      console.log(result.data.data);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  //Get groups in which player is member
  useEffect(() => {
    getGroups();
  }, []);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: Font.black, marginBottom: 40}}>
      {/* Model to select Group */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={groupModal}
        style={{justifyContent: 'flex-end', margin: 0}}
        onRequestClose={() => {
          setGroupModal(!groupModal);
        }}>
        <View
          style={{
            // flex: 1,
            height: 700,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View style={styles.GroupmodalView}>
            <View
              style={{
                margin: 15,
                marginBottom: 0,
                paddingBottom: 15,
                borderBottomWidth: 0.5,
                borderColor: 'grey',
              }}>
              <Text style={Commonstyles?.TextWhiteFeatured}>
                Share in group
              </Text>
            </View>

            {/* Search bar */}
            <View
              style={{
                justifyContent: 'center',
                margin: 15,
              }}>
              <TextInput
                name="email"
                style={Commonstyles?.inputTextBlack}
                placeholder="Search Group"
                placeholderTextColor={Font.greyText}
                onChangeText={text => {
                  text = text.toLowerCase();
                  setGroupArrayToShow(
                    groupArrayFromBackend?.filter(data => {
                      console.log(data?.title);
                      var user = data?.title.toLowerCase();
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

            {/* Flatlist to show groups */}
            {groupArrayToShow.length === 0 ? (
              <View>
                <Loader />
              </View>
            ) : (
              <FlatList
                contentContainerStyle={{paddingBottom: 0}}
                showsVerticalScrollIndicator={false}
                data={groupArrayToShow}
                renderItem={({item, index}) => {
                  const TotalMembers = item?.Members.length;

                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          console.log('I am pressed');
                          setGroupId(item?._id);
                        }}
                        style={{
                          marginLeft: 15,
                          marginRight: 15,
                          marginBottom: 8,
                          backgroundColor: Font.black,

                          borderRadius: 5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {/* Left Side */}
                        <View style={{margin: 10, flexDirection: 'row'}}>
                          {/* Image */}
                          <View>
                            <Image
                              source={{
                                uri: item?.image,
                              }}
                              style={{
                                width: 61,
                                height: 59,

                                borderRadius: 7,
                              }}
                            />
                          </View>
                          {/* Group Info */}
                          <View style={{marginLeft: 13}}>
                            <Text style={Commonstyles.TextWhiteGroupName}>
                              {item?.title}
                            </Text>
                            <Text style={Commonstyles.TextWhitesmall}>
                              {TotalMembers} Members
                            </Text>
                          </View>
                        </View>
                        {/* Right Side with tick icon */}
                        <View style={{marginRight: 10, alignSelf: 'center'}}>
                          <TouchableOpacity>
                            <AntDesign
                              name={'checkcircle'}
                              size={15}
                              color={
                                item?._id === groupId ? Font.green : Font.white
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            )}

            <View
              style={{
                paddingBottom: 20,
                paddingTop: 10,
                marginTop: 10,
                marginLeft: 15,
                marginRight: 15,

                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                disabled={groupId?.length === 0}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 54,
                  backgroundColor: groupId.length === 0 ? 'grey' : '#1DB954',
                  borderRadius: 10,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  sharePostInGroup();
                }}>
                <FontAwesome
                  name={'group'}
                  size={14}
                  color={Font.white}
                  style={{marginRight: 10}}
                />
                <Text style={Commonstyles.TextWhite}>Share in group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
          <Text style={Commonstyles.LogoWhite}>{userdetails?.name}</Text>
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
            keyboardType="email-address"
            onChangeText={data => {
              setStatus(data);
            }}
          />
        </View>
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

export default ProfileAddPost;

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

  GroupmodalView: {
    width: '85%',
    height: '54%',
    marginBottom: 10,
    borderRadius: 26,
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
});
