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
import React, {useState, useContext, useEffect} from 'react';
import CartProvider from '../../ContextApi/contextApi';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';

import Loader from '../../Loader/Loader';

//Importing FlatList
import FlatListForFeed from '../../Components/FlatListForFeed';
import port from '../../Port/Port';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import font and design
import {Font, Commonstyles} from '../../Font/Font';

const IndividualGroup = ({navigation, route}) => {
  const Nav = navigation;
  const isFocused = useIsFocused();
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cond, setCondition] = useState(true);
  const [getDataCondition, setDataCondition] = useState(false);
  const GroupArray = route.params.grouparray;

  const TotalMemeber = GroupArray?.Members.length;
  if (GroupArray?.Members.length > 4) {
    var User = GroupArray.Members.slice(1, 5);
  } else {
    var User = GroupArray.Members;
  }
  const [feedArrayFromBackend, setFeedArrayFromBackend] = useState([]);

  //getting newsfeed from backend
  const getNewsFeed = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/newsfeed/GetGroupNewsFeed/${GroupArray?._id}`,
      );

      setFeedArrayFromBackend(result.data.data);

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  useEffect(() => {
    isFocused && getNewsFeed();
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
          <Text style={Commonstyles.LogoWhite}>
            {GroupArray?.title}
            {'\n'}
            <Text style={Commonstyles.TextGrey}>
              See what's new in the group
            </Text>
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
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View>
          {/* Group Info */}
          <View
            style={{
              backgroundColor: Font.grey,
              paddingBottom: 15,
              marginBottom: 10,
            }}>
            <View style={{margin: 13}}>
              <Image
                source={{
                  uri: GroupArray?.image,
                }}
                style={{
                  width: '100%',
                  height: 140,

                  borderRadius: 5,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                margin: 13,
                marginTop: 0,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={Commonstyles.TextWhiteGroupName}>
                  {GroupArray?.title}
                  {'  '}
                  <Text style={Commonstyles.TextGreysmall}>
                    {TotalMemeber} Members
                  </Text>
                </Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  {User.map(user => {
                    return (
                      <View>
                        <Image
                          source={{
                            uri: user?.image,
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
                  {GroupArray?.Members.length > 4 ? (
                    <TouchableOpacity style={{marginLeft: 2}}>
                      <AntDesign
                        name={'pluscircleo'}
                        size={24}
                        color={Font.white}
                        style={{marginRight: 8}}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('IndividualGroupDetails', {
                      groupArray: GroupArray,
                      GroupPostsInfo: feedArrayFromBackend,
                    });
                  }}>
                  <Entypo
                    name={'dots-three-horizontal'}
                    size={23}
                    color={Font.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Post thing */}
          <View
            style={{
              backgroundColor: Font.grey,
              paddingBottom: 20,
              marginBottom: 10,
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
                  navigation.navigate('GroupAddPost', {
                    groupArray: GroupArray,
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
                  navigation.navigate('GroupAddPost', {
                    groupArray: GroupArray,
                  });
                }}>
                <Feather name={'image'} size={23} color={Font.white} />
                <Text style={styles.TextWhite}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  navigation.navigate('GroupAddPost', {
                    groupArray: GroupArray,
                  });
                }}>
                <FontAwesome
                  name={'video-camera'}
                  size={23}
                  color={Font.green}
                />
                <Text style={styles.TextWhite}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  navigation.navigate('GroupAddPost', {
                    groupArray: GroupArray,
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

          <FlatListForFeed
            FeedArray={feedArrayFromBackend}
            setDataCondition={setDataCondition}
            getDataCondition={getDataCondition}
            navigation={Nav}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default IndividualGroup;

const styles = StyleSheet.create({
  TextWhite: {
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
