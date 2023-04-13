import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
  Image,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import CartProvider from '../../../ContextApi/contextApi';
import port from '../../../Port/Port';
import {useIsFocused} from '@react-navigation/native';

import moment from 'moment';

import Loader from '../../../Loader/Loader';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const Orders = ({navigation}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const isFocused = useIsFocused();
  const [cond, setCondition] = useState(true);
  const [dataFromBackend, setDataFromBackend] = useState([]);
  const [pendingOrder, setPendingOrder] = useState([]);
  const [deliveredOrder, setDeliveredOrder] = useState([]);
  const [Category, setCategory] = useState('All');

  //Get products
  const getOrders = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/CustomerBuyingNotificationRoute/getNotification/${userdetails?._id}`,
      );

      setDataFromBackend(result.data.data.reverse());
      setPendingOrder(
        result.data.data.filter(data => data?.status === 'Pending'),
      );

      setDeliveredOrder(
        result.data.data.filter(data => data?.status === 'Delivered'),
      );

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  //Get product from backend
  useEffect(() => {
    isFocused && getOrders();
  }, [isFocused]);
  const ProductList = ({products}) => {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 200}}
          data={products}
          renderItem={({item, index}) => {
            const Date = moment(item?.createdAt).utc().format('MM/DD/YYYY');
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Recipt', {product: item});
                }}
                style={{
                  borderRadius: 10,
                  margin: 15,
                  marginTop: 10,
                  flexDirection: 'row',
                  flex: 1,
                  backgroundColor: Font.grey,
                  padding: 10,
                }}>
                <Image
                  source={{
                    uri: item?.refOfProduct?.coverphoto,
                  }}
                  style={{
                    width: 63,
                    height: 63,
                    borderRadius: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                    flex: 1,
                  }}>
                  <View
                    style={{marginLeft: 10, justifyContent: 'space-between'}}>
                    <View>
                      <Text style={Commonstyles?.TextGreen14500}>
                        {item?.refOfProduct?.productname}
                      </Text>
                      <Text style={Commonstyles?.TextGreen14}>
                        {item?.size.length === 0 ? 'Any size' : item?.size}
                      </Text>

                      <Text style={Commonstyles?.TextWhite}>
                        ${item?.price}
                      </Text>
                    </View>
                    <View
                      style={{flexDirection: 'row', marginBottom: 5}}></View>
                  </View>
                  <View style={{justifyContent: 'space-between'}}>
                    <View
                      style={{
                        alignSelf: 'flex-end',
                        margin: 5,
                        width: 63,
                        height: 18,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:
                          item?.status === 'Pending'
                            ? Font?.blue
                            : item?.status === 'Delivered'
                            ? Font?.green
                            : Font?.red,
                      }}>
                      <Text style={Commonstyles?.TextWhitesmallEmail}>
                        {item?.status}
                      </Text>
                    </View>
                    <Text style={Commonstyles.TextGreysmallmini}>{Date}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
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
            marginLeft: 15,
            alignItems: 'center',
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
          <Text style={Commonstyles.LogoWhite}>Orders</Text>
        </View>
        {/* Notification icon */}
        <View
          style={{
            justifyContent: 'center',
            marginRight: 15,
            flexDirection: 'row',

            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => {
              navigation.navigate('Search');
            }}>
            <AntDesign name={'search1'} size={20} color={Font.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cart');
            }}>
            <MaterialCommunityIcons
              name={'shopping-outline'}
              size={22}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={{margin: 15}}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              setCategory('All');
            }}
            style={{
              height: 38,

              borderRadius: 5,
              marginRight: 8,
              flex: 1,

              alignItems: 'center',
              justifyContent: 'center',

              borderWidth: 1,
              borderColor: Category === 'All' ? Font.green : Font.greyText,
            }}>
            <Text style={Commonstyles?.TextWhite}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 38,

              borderRadius: 5,
              marginRight: 8,

              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,

              borderWidth: 1,
              borderColor: Category === 'Pending' ? Font.green : Font.greyText,
            }}
            onPress={() => {
              setCategory('Pending');
            }}>
            <Text style={Commonstyles?.TextWhite}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 38,

              borderRadius: 5,
              marginRight: 8,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',

              borderWidth: 1,
              borderColor:
                Category === 'Delivered' ? Font.green : Font.greyText,
            }}
            onPress={() => {
              setCategory('Delivered');
            }}>
            <Text style={Commonstyles?.TextWhite}>Delivered</Text>
          </TouchableOpacity>
        </View>
      </View>
      {cond ? (
        <View style={{marginTop: 40}}>
          <Loader />
        </View>
      ) : (
        <View style={{marginTop: 40}}>
          {/* Products list */}
          {Category === 'All' ? (
            <View>
              <ProductList products={dataFromBackend} />
            </View>
          ) : Category === 'Pending' ? (
            <View>
              <ProductList products={pendingOrder} />
            </View>
          ) : (
            <View>
              <ProductList products={deliveredOrder} />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({});
