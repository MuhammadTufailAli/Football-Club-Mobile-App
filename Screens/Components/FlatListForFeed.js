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
import CartProvider from '../ContextApi/contextApi';
import port from '../Port/Port';
import Video from 'react-native-video';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Loader from '../Loader/Loader';

//import font and design
import {Font, Commonstyles} from '../Font/Font';

const FlatListForFeed = ({
  navigation,
  FeedArray,
  setDataCondition,
  getDataCondition,
  role,
}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [groupModal, setGroupModal] = useState(false);
  const [groupArrayFromBackend, setGroupArrayFromBackend] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [PostToBeSharedInGroup, setPostToBeSharedInGroup] = useState();
  const [groupArrayToShow, setGroupArrayToShow] = useState([]);
  const [condForGroup, setConfForGroup] = useState(true);

  //Get groups in which player is member
  const getGroups = async () => {
    if (role === 'Parent') {
      try {
        const result = await axios.get(
          `${port.herokuPort}/group/GetAllPlayerGroups/${userdetails?.refOfPlayer}`,
        );

        setGroupArrayFromBackend(result.data.data);
        setGroupArrayToShow(result.data.data);
        setConfForGroup(false);
      } catch (err) {
        alert('Error');
      }
    } else {
      try {
        const result = await axios.get(
          `${port.herokuPort}/group/GetAllPlayerGroups/${userdetails?._id}`,
        );

        setGroupArrayFromBackend(result.data.data);
        setGroupArrayToShow(result.data.data);
        setConfForGroup(false);
      } catch (err) {
        alert('Error');
      }
    }
  };

  //sharing post in group
  const sharePostInGroup = async () => {
    try {
      const result = await axios.post(
        `${port.herokuPort}/newsfeed/ShareNewsFeed`,
        PostToBeSharedInGroup,
      );

      alert('Post shared succesfully');
      setGroupModal(false);
    } catch (err) {
      console.log(err.response.data.message);
      alert(err.response.data.message);
    }
  };

  //Adding like to a post
  const addLike = async refOfNewsfeed => {
    const CheckFirst = {
      refOfNewsfeed: refOfNewsfeed,
      refOfUser: userdetails?._id,
    };
    try {
      const result = await axios.post(
        `${port.herokuPort}/like/DeleteLike`,
        CheckFirst,
      );
      setDataCondition(!getDataCondition);
    } catch (err) {
      try {
        const result = await axios.post(
          `${port.herokuPort}/like/PostLike`,
          CheckFirst,
        );
        setDataCondition(!getDataCondition);
      } catch (err) {
        console.log(err.response.data.message);
        alert(err.response.data.message);
      }
      console.log(err.response.data.message);
    }
  };

  //Get groups in which player is member
  useEffect(() => {
    getGroups();
  }, []);

  return (
    <View style={{flex: 1}}>
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
            {condForGroup ? (
              <View>
                <Loader />
              </View>
            ) : groupArrayToShow.length === 0 ? (
              <View style={{margin: 15}}>
                <Text style={Commonstyles?.TextWhite}>
                  Your are not in any group yet :(
                </Text>
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
                          <TouchableOpacity
                            onPress={() => {
                              setGroupId(item?._id);
                            }}>
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
                  setPostToBeSharedInGroup(
                    (PostToBeSharedInGroup.refOfGroup = groupId),
                  );
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
      <FlatList
        contentContainerStyle={{paddingBottom: 70}}
        showsVerticalScrollIndicator={false}
        data={FeedArray}
        renderItem={({item, index}) => {
          const TotalLike = item?.Like?.length;
          const TotalComment = item?.Comment?.length;
          var showLikeCond = false;
          if (item?.Like?.length != 0) {
            for (var i = 0; i < item?.Like?.length; i++) {
              if (item?.Like[i]?.refOfUser?._id === userdetails?._id) {
                showLikeCond = true;
                break;
              }
            }
          }

          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('IndividualPost', {
                  PostDetails: item,
                  setDataCondition: setDataCondition,
                  getDataCondition: getDataCondition,
                });
              }}
              style={{
                marginBottom: 13,
                backgroundColor: Font.grey,
                paddingBottom: 5,
              }}>
              {/* Top Part */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 15,
                }}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Image
                    source={{
                      uri: item?.refOfUser?.image,
                    }}
                    style={{
                      width: 34,
                      height: 34,

                      borderRadius: 90 / 2,
                    }}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={Commonstyles.TextGreysmallEmail}>
                      {item?.refOfUser?.email}
                      {'  '}

                      {'\n'}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View>
                          <Text style={Commonstyles.TextWhite}>
                            {item?.refOfUser?.name}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: 90 / 2,
                            marginLeft: 10,
                            backgroundColor: item?.refOfUser?.isLoggedIn
                              ? 'green'
                              : 'red',
                          }}></View>
                      </View>
                    </Text>
                  </View>
                  {item?.refOfUser?.role ? (
                    <Text
                      style={{
                        fontFamily: 'Lexend-Light',
                        fontSize: 10,
                        fontWeight: '300',
                        color: '#FFFFFF',
                        backgroundColor:
                          item?.refOfUser?.role === 'Admin'
                            ? Font.green
                            : Font.greyText,
                        borderRadius: 5,
                        width: 45,
                        height: 19,
                        textAlign: 'center',
                      }}>
                      {item?.refOfUser?.role}
                    </Text>
                  ) : null}
                </View>

                <View style={{justifyContent: 'center'}}>
                  <TouchableOpacity>
                    <Entypo
                      name={'dots-three-horizontal'}
                      size={28}
                      color={Font.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Status area */}
              {item.status ? (
                <View style={styles.allViewStyle}>
                  <Text style={Commonstyles.TextWhiteFeed}>{item?.status}</Text>
                </View>
              ) : null}

              {/* Image Area */}
              {item?.image ? (
                item.image.length === 0 ? null : (
                  <View style={styles.allViewStyle}>
                    <Image
                      source={{
                        uri: item?.image,
                      }}
                      style={{
                        width: '100%',
                        height: 207,

                        borderRadius: 8,
                      }}
                    />
                  </View>
                )
              ) : null}
              {/* Video Area */}
              {item.video ? (
                item.video.length === 0 ? null : (
                  <View style={styles.allViewStyle}>
                    <Video
                      source={{uri: item?.video}}
                      repeat={true}
                      muted={true}
                      resizeMode="cover"
                      ref={ref => {
                        this.player = ref;
                      }} // Store reference
                      onBuffer={this.onBuffer}
                      onError={this.videoError}
                      style={{
                        width: '100%',
                        height: 207,

                        borderRadius: 8,
                      }}
                    />
                  </View>
                )
              ) : null}

              {/* Like comment area */}
              <View
                style={{
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      addLike(item?._id);
                    }}>
                    <AntDesign
                      name={'heart'}
                      size={22}
                      color={
                        item?.Like.length != 0
                          ? showLikeCond
                            ? '#ED213E'
                            : 'white'
                          : 'white'
                      }
                      style={{marginRight: 8}}
                    />
                  </TouchableOpacity>
                  <Text style={Commonstyles.TextWhite}>{TotalLike}</Text>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Comments', {
                        item: item,
                        refOfNewsfeed: item?._id,
                      });
                    }}>
                    <FontAwesome
                      name={'commenting'}
                      size={22}
                      color={Font.white}
                      style={{marginRight: 8, marginLeft: 15}}
                    />
                  </TouchableOpacity>
                  <Text style={Commonstyles.TextWhite}>{TotalComment}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      const obj = {
                        refOfGroup: item?.refOfGroup,
                        status: item?.status ? item?.status : '',
                        image: item?.image ? item?.image : '',
                        refOfUser: userdetails?._id,
                        video: item?.video ? item?.video : '',
                      };
                      setPostToBeSharedInGroup(obj);
                      console.log(obj);
                      setGroupModal(true);
                    }}>
                    <FontAwesome
                      name={'share'}
                      size={18}
                      color={Font.white}
                      style={{marginRight: 8, marginLeft: 15}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default FlatListForFeed;

const styles = StyleSheet.create({
  allViewStyle: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
  },
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
