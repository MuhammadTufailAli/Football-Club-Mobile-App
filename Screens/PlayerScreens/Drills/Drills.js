import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
  TextInput,
  Image,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import CartProvider from '../../ContextApi/contextApi';
import port from '../../Port/Port';
import {useIsFocused} from '@react-navigation/native';
//import font and design
import {Font, Commonstyles} from '../../Font/Font';
import Video from 'react-native-video';

import moment from 'moment';

import Loader from '../../Loader/Loader';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const Products = ({products, navigation}) => {
  return (
    <View>
      <FlatList
        contentContainerStyle={{paddingBottom: 310}}
        showsVerticalScrollIndicator={false}
        data={products}
        renderItem={({item, index}) => {
          const Date = moment(item?.createdAt).utc().format('MM/DD/YYYY');
          return (
            <TouchableOpacity
              style={{borderRadius: 10, marginTop: 15, marginBottom: 15}}
              onPress={() => {
                navigation.navigate('IndividualDrill', {
                  drill: item,
                });
              }}>
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
              {/* Video details */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 15,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',
                    flex: 6,
                  }}>
                  <View>
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
                  </View>

                  <View style={{marginLeft: 10}}>
                    <View>
                      <Text style={Commonstyles.TextWhiteMembersName}>
                        {item?.drilltitle}
                      </Text>
                    </View>

                    <View
                      style={{
                        marginTop: 10,

                        width: '95%',
                      }}>
                      <Text
                        numberOfLines={3}
                        style={Commonstyles.TextWhite12300}>
                        {item?.description}
                      </Text>
                    </View>
                    <View style={{marginTop: 5}}>
                      <Text style={Commonstyles.TextGreysmallmini}>{Date}</Text>
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center', flex: 1.5}}>
                  <View
                    style={{
                      height: 27,
                      width: 76,
                      borderRadius: 5,

                      alignItems: 'center',
                      justifyContent: 'center',

                      borderWidth: 1,
                      backgroundColor: Font.green,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Lexend-Light',
                        fontSize: 10,
                        fontWeight: '300',
                        color: '#FFFFFF',
                      }}>
                      {item?.refOfVideoCat?.title}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const Drills = ({navigation}) => {
  const Nav = navigation;
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const isFocused = useIsFocused();
  const [Category, setCategory] = useState('All');

  const [cond, setCondition] = useState(true);
  const [dataFromBackend, setDataFromBackend] = useState([]);
  const [dataToShow, setDataToShow] = useState([]);
  const [products, setProducts] = useState([]);

  //Get products
  const getDrills = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/videocategory/GetAllVideoCategories`,
      );

      const arr = [];

      const allProducts = result.data.data.map(data => {
        data?.Drill.map(data => {
          arr.push(data);
        });
      });

      var Data = result.data.data;

      setProducts(arr);
      setDataToShow(arr);
      Data.unshift({title: 'All', Drill: arr});

      setDataFromBackend(Data);

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  //Get Drills from backend
  useEffect(() => {
    isFocused && getDrills();
  }, [isFocused]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Font.black}}>
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
          <Text style={Commonstyles.LogoWhite}>Drills</Text>
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

      {/* Search bar */}
      <View
        style={{
          justifyContent: 'center',
          margin: 15,
        }}>
        <TextInput
          name="email"
          style={Commonstyles.inputText}
          placeholder="Search drill"
          placeholderTextColor={Font.greyText}
          onChangeText={text => {
            text = text.toLowerCase();
            setDataToShow(
              products?.filter(data => {
                var user = data?.drilltitle.toLowerCase();
                if (user.includes(text)) {
                  return data;
                }
              }),
            );
          }}
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

      {/* Categories */}
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View style={{margin: 15, marginRight: 0, marginTop: 5}}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={dataFromBackend}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setCategory(item.title);

                    setDataToShow(item?.Drill);
                  }}
                  style={{
                    height: 27,
                    width: 'auto',
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 5,
                    marginRight: 8,

                    alignItems: 'center',
                    justifyContent: 'center',

                    borderWidth: 1,
                    backgroundColor:
                      item.title === Category ? Font.green : Font.greyText,
                  }}>
                  <Text style={Commonstyles?.TextWhite12300}>
                    {item?.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* Showing Selected category */}
      <View>
        <Products products={dataToShow} navigation={Nav} />
      </View>
    </SafeAreaView>
  );
};

export default Drills;

const styles = StyleSheet.create({
  allViewStyle: {
    marginLeft: 15,
    marginRight: 15,
  },
});
