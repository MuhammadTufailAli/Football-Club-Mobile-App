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

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const Recipt = ({navigation, route}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const Product = route?.params?.product;
  console.log(Product?.quantity);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: Font.black}}
      showsVerticalScrollIndicator={false}>
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
          <Text style={Commonstyles.LogoWhite}>Reciept</Text>
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

      {/* Product Area */}
      <View>
        <View
          style={{
            margin: 15,
          }}>
          <Text style={Commonstyles?.TextWhiteFeatured}>Product</Text>
        </View>
        <View
          style={{
            borderRadius: 10,
            margin: 15,
            marginTop: 0,
            flexDirection: 'row',
          }}>
          <Image
            source={{
              uri: Product?.refOfProduct?.coverphoto,
            }}
            style={{
              width: 113,
              height: 135,
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
              style={{
                marginLeft: 10,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={Commonstyles?.TextGreen14500}>
                  {Product?.refOfProduct?.productname}
                </Text>
                <Text style={Commonstyles?.TextGreysmallmini}>
                  {Product?.refOfProduct?.quantity > 0
                    ? 'In Stock'
                    : 'Out of stock'}
                </Text>

                <Text style={Commonstyles?.TextWhite}>
                  ${Product?.refOfProduct?.price}
                </Text>

                <Text style={Commonstyles?.TextWhiteCalender}>
                  Qty:{' '}
                  <Text style={Commonstyles?.TextGreen14}>
                    {Product?.quantity}
                  </Text>
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ShopHome');
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 6,
                    backgroundColor: '#1DB954',
                    borderRadius: 5,
                    marginTop: 10,
                  }}>
                  <Text style={Commonstyles?.TextWhitesmall}>Shop Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* Dash Line*/}
      <Text ellipsizeMode="clip" numberOfLines={1} style={{color: 'grey'}}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - -
      </Text>
      {/* Delivery Address */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles?.TextWhiteFeatured}>Delivery Address</Text>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          {/* location Icon */}
          <View
            style={{
              width: 48,
              height: 50,

              backgroundColor: Font?.grey,
              alignItems: 'center',
              justifyContent: 'center',

              borderRadius: 10,
            }}>
            <Ionicons name={'location-sharp'} size={26} color={'white'} />
          </View>
          {/* Location Details */}
          <View style={{marginLeft: 15, justifyContent: 'center'}}>
            <Text style={Commonstyles?.TextGreysmall300}>Location</Text>
            <Text style={Commonstyles?.TextWhite}>
              {Product?.deliveryAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* Date Ordered */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles?.TextWhiteFeatured}>Date Ordered</Text>
        <Text style={Commonstyles?.TextWhiteCalenderGreen}>
          {moment(Product?.createdAt).utc().format('MM/DD/YYYY')}
        </Text>
      </View>
      {/* Delivery Date */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles?.TextWhiteFeatured}>Expexted Delivery</Text>
        <Text style={Commonstyles?.TextWhiteCalenderGreen}>After 7 days</Text>
      </View>

      {/* Dash Line*/}
      <Text ellipsizeMode="clip" numberOfLines={1} style={{color: 'grey'}}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - -
      </Text>

      {/* Payment */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles?.TextWhiteFeatured}>Payment</Text>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          {/* Card Icon */}
          <View
            style={{
              width: 48,
              height: 50,

              backgroundColor: Font?.grey,
              alignItems: 'center',
              justifyContent: 'center',

              borderRadius: 10,
            }}>
            <Entypo name={'credit-card'} size={26} color={'white'} />
          </View>
          {/* Payment */}
          <View style={{marginLeft: 15, justifyContent: 'center'}}>
            <Text style={Commonstyles?.TextGreysmall300}>Payment</Text>
            <Text style={Commonstyles?.TextWhite}>Using Card</Text>
          </View>
        </View>
      </View>

      {/* Dash Line*/}
      <Text ellipsizeMode="clip" numberOfLines={1} style={{color: 'grey'}}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - -
      </Text>
      {/* Total Money */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 15,
          paddingBottom: 90,
        }}>
        <Text style={Commonstyles?.TextWGreyMembersName}>Total</Text>
        <Text style={Commonstyles?.TextWGreyMembersName}>
          $ <Text style={Commonstyles?.LogoWhite20500}>{Product?.price}</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default Recipt;

const styles = StyleSheet.create({});
