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
import {useIsFocused} from '@react-navigation/native';
import Loader from '../Loader/Loader';

import Video from 'react-native-video';

//import font and design
import {Font, Commonstyles} from '../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const IndividualPost = ({navigation, route}) => {
  const refOfNewsfeed = route?.params?.PostDetails?.Comment[0]?.refOfNewsfeed;
  const PostDetails = route?.params?.PostDetails;
  const isFocused = useIsFocused();

  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [groupModal, setGroupModal] = useState(false);
  const [groupArrayFromBackend, setGroupArrayFromBackend] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [PostToBeSharedInGroup, setPostToBeSharedInGroup] = useState();
  const [groupArrayToShow, setGroupArrayToShow] = useState([]);
  const [cond, setCondition] = useState(true);

  const [NewsFeedArrayFromBackend, setNewsFeedArrayFromBackend] = useState([]);
  const [getDataCondition, setDataCondition] = useState(false);
  const [showLikeCond, setshowLikeCond] = useState(false);

  //sharing post in group
  const sharePostInGroup = async () => {
    console.log(PostToBeSharedInGroup);
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
  //Get groups in which player is member
  const getNewsFeed = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/newsfeed/GetSingleNewsFeed/${PostDetails?._id}`,
      );

      setNewsFeedArrayFromBackend(result.data.data.doc);
      const item = result.data.data.doc;

      if (item?.Like?.length != 0) {
        for (var i = 0; i < item?.Like?.length; i++) {
          if (item?.Like[i]?.refOfUser?._id === userdetails?._id) {
            setshowLikeCond(true);
            break;
          }
        }
      }

      console.log(result.data.data.doc);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }

    try {
      const result = await axios.get(
        `${port.herokuPort}/group/GetAllPlayerGroups/${userdetails?._id}`,
      );

      setGroupArrayFromBackend(result.data.data);
      setGroupArrayToShow(result.data.data);
      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  //Adding like to a post
  const addLike = async refOfNewsfeed => {
    console.log(refOfNewsfeed);
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
    isFocused && getNewsFeed();
  }, [isFocused, getDataCondition]);

  if (cond) {
    return (
      <View>
        <Loader />
      </View>
    );
  } else {
    return (
      <ScrollView style={{flex: 1, backgroundColor: Font.black}}>
        {/* Select group */}
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
                                  item?._id === groupId
                                    ? Font.green
                                    : Font.white
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
                navigation.goBack();
              }}>
              <AntDesign name={'left'} size={20} color={Font.white} />
            </TouchableOpacity>
            <Text style={Commonstyles.TextWhiteCalender}>
              {NewsFeedArrayFromBackend?.refOfUser?.name}
              {'\n'}
              <Text style={Commonstyles.TextGrey}>Post</Text>
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
                if (userdetails?.role === 'Player') {
                  navigation.navigate('PlayerNotification');
                } else {
                  navigation.navigate('ParentNotification');
                }
              }}>
              <Ionicons
                name={'notifications-outline'}
                size={28}
                color={Font.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post area */}

        <View
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
                  uri: NewsFeedArrayFromBackend?.refOfUser?.image,
                }}
                style={{
                  width: 34,
                  height: 34,

                  borderRadius: 90 / 2,
                }}
              />
              <View style={{marginLeft: 10}}>
                <Text style={Commonstyles.TextGreysmallEmail}>
                  {NewsFeedArrayFromBackend?.refOfUser?.email}
                  {'  '}

                  {'\n'}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text style={Commonstyles.TextWhite}>
                        {NewsFeedArrayFromBackend?.refOfUser?.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 90 / 2,
                        marginLeft: 10,
                        backgroundColor: NewsFeedArrayFromBackend?.refOfUser
                          ?.isLoggedIn
                          ? 'green'
                          : 'red',
                      }}></View>
                  </View>
                </Text>
              </View>
              {NewsFeedArrayFromBackend?.refOfUser?.role ? (
                <Text
                  style={{
                    fontFamily: 'Lexend-Light',
                    fontSize: 10,
                    fontWeight: '300',
                    color: '#FFFFFF',
                    backgroundColor:
                      NewsFeedArrayFromBackend?.Role === 'Admin'
                        ? Font.green
                        : Font.greyText,
                    borderRadius: 5,
                    width: 45,
                    height: 19,
                    textAlign: 'center',
                  }}>
                  {NewsFeedArrayFromBackend?.refOfUser?.role}
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
          {NewsFeedArrayFromBackend?.status ? (
            <View style={styles.allViewStyle}>
              <Text style={Commonstyles.TextWhiteFeed}>
                {NewsFeedArrayFromBackend?.status}
              </Text>
            </View>
          ) : null}

          {/* Image Area */}
          {NewsFeedArrayFromBackend?.image ? (
            <View style={styles.allViewStyle}>
              <Image
                source={{
                  uri: NewsFeedArrayFromBackend?.image,
                }}
                style={{
                  width: '100%',
                  height: 207,

                  borderRadius: 8,
                }}
              />
            </View>
          ) : null}

          {/* Video Area */}
          {NewsFeedArrayFromBackend?.video ? (
            NewsFeedArrayFromBackend.video.length === 0 ? null : (
              <View
                style={{
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 20,
                  alignItems: 'center',
                }}>
                <Video
                  source={{uri: NewsFeedArrayFromBackend?.video}}
                  controls={true}
                  repeat={true}
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
                  addLike(NewsFeedArrayFromBackend?._id);
                }}>
                <AntDesign
                  name={'heart'}
                  size={22}
                  color={
                    NewsFeedArrayFromBackend?.Like.length != 0
                      ? showLikeCond
                        ? '#ED213E'
                        : 'white'
                      : 'white'
                  }
                  style={{marginRight: 8}}
                />
              </TouchableOpacity>
              <Text style={Commonstyles.TextWhite}>
                {NewsFeedArrayFromBackend?.Like?.length}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Comments', {
                    item: NewsFeedArrayFromBackend,
                    refOfNewsfeed: NewsFeedArrayFromBackend?._id,
                  });
                }}>
                <FontAwesome
                  name={'commenting'}
                  size={22}
                  color={Font.white}
                  style={{marginRight: 8, marginLeft: 15}}
                />
              </TouchableOpacity>
              <Text style={Commonstyles.TextWhite}>
                {NewsFeedArrayFromBackend?.Comment?.length}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  const obj = {
                    refOfGroup: NewsFeedArrayFromBackend?.refOfGroup,
                    status: NewsFeedArrayFromBackend?.status
                      ? NewsFeedArrayFromBackend?.status
                      : '',
                    image: NewsFeedArrayFromBackend?.image
                      ? NewsFeedArrayFromBackend?.image
                      : '',
                    refOfUser: userdetails?._id,
                    video: NewsFeedArrayFromBackend?.video
                      ? NewsFeedArrayFromBackend?.video
                      : '',
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
        </View>
      </ScrollView>
    );
  }
};

export default IndividualPost;

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
