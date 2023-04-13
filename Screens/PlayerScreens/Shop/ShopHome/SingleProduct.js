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
} from 'react-native';
import React, {useState, useContext} from 'react';
import CartProvider from '../../../ContextApi/contextApi';
import axios from 'axios';
import port from '../../../Port/Port';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SingleProduct = ({navigation, route}) => {
  const Product = route?.params?.product;
  if (Product?.sizes.length > 3) {
    var Sizes = Product.sizes.slice(1, 4);
  } else {
    var Sizes = Product.sizes;
  }

  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  //Add to cart
  const AddToCart = async () => {
    var CartData = {
      quantity: quantity,
      size: size,
      color: color,
      refOfUser: userdetails?._id,
      refOfProduct: Product?._id,
    };

    try {
      const result = await axios.post(
        `${port.herokuPort}/cart/addToCart`,
        CartData,
      );
      alert('Added to cart Successfully');
    } catch (err) {
      console.log(err.response);
      alert('Error');
    }
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
          <Text style={Commonstyles.LogoWhite}>Product</Text>
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

      <ScrollView
        contentContainerStyle={{paddingBottom: 70}}
        showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View>
          <ImageBackground
            source={{
              uri: Product?.coverphoto,
            }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: 358,
              justifyContent: 'space-between',
            }}>
            <View style={{margin: 15}}>
              <Text style={Commonstyles?.TextWhite24}>
                {Product?.productname}
              </Text>
              <Text style={Commonstyles?.TextGreen14}>
                {Sizes?.map(size => {
                  return size + ' ';
                })}
              </Text>
            </View>
            <View style={{alignItems: 'center', marginBottom: 15}}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.quantity}
                  onPress={() => {
                    if (quantity <= 1) {
                      alert('There must be atleast 1 product');
                    } else {
                      setQuantity(quantity - 1);
                    }
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: '#181F2A',
                    }}>
                    -
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{marginLeft: 12, marginRight: 12, color: Font.white}}>
                  {quantity}
                </Text>

                <TouchableOpacity
                  style={styles.quantity}
                  onPress={() => {
                    if (quantity >= Product.quantity) {
                      alert('Product limit reached');
                    } else {
                      setQuantity(quantity + 1);
                    }
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: '#181F2A',
                    }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
        {/* Product details */}
        <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
          <View
            style={{
              margin: 15,
              marginTop: 25,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={Commonstyles?.TextWhite24400}>
                ${Product?.price}
              </Text>
              {Product?.quantity > 0 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: Font.green,
                      borderRadius: 90 / 2,
                      marginRight: 5,
                    }}></View>
                  <Text style={Commonstyles?.TextGreysmallmini}>In Stock</Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: 'red',
                      borderRadius: 90 / 2,
                      marginRight: 5,
                    }}></View>
                  <Text style={Commonstyles?.TextGreysmallmini}>
                    Out of stock
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                AddToCart();
              }}
              style={{
                width: 36,
                height: 38,
                borderRadius: 5,
                backgroundColor: Font.greyNew,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcons
                name={'shopping-outline'}
                size={18}
                color={Font.green}
              />
            </TouchableOpacity>
          </View>
          {/* description */}
          <View style={{margin: 15}}>
            <Text style={Commonstyles?.TextWhiteCalender}>
              {Product?.description}
            </Text>
          </View>
          <View style={{margin: 15, marginRight: 0}}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={Product?.sizes}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSize(item);
                    }}
                    style={{
                      height: 38,
                      width: 77,
                      borderRadius: 5,
                      marginRight: 5,

                      alignItems: 'center',
                      justifyContent: 'center',

                      borderWidth: 1,
                      borderColor: size === item ? Font.green : Font.greyText,
                    }}>
                    <Text style={Commonstyles?.TextWhite}>{item}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            {Product?.colors.length === 0 ? null : (
              <View style={{marginTop: 15}}>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={Product?.colors}
                  renderItem={({item, index}) => {
                    const Color = item.toLowerCase();

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setColor(Color);
                        }}
                        style={{
                          height: 34,
                          width: 34,
                          borderRadius: 5,
                          marginRight: 5,

                          alignItems: 'center',
                          justifyContent: 'center',

                          borderWidth: 1,
                          borderColor:
                            color === Color ? Font.green : Font.greyText,
                          backgroundColor: Color,
                        }}></TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
          </View>
          <View style={{margin: 15}}>
            <TouchableOpacity
              disabled={Product?.quantity <= 0 ? true : false}
              style={
                Product?.quantity <= 0
                  ? Commonstyles.ButtonGrey
                  : Commonstyles.ButtonGreen
              }
              onPress={() => {
                navigation.navigate('Checkout', {
                  product: Product,
                  quantity: quantity,
                  color: color,
                  size: size,
                  from: 'SingleProduct',
                });
              }}>
              <Text style={Commonstyles.TextWhite}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleProduct;

const styles = StyleSheet.create({
  quantity: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',

    alignItems: 'center',
    backgroundColor: Font.white,
  },
});
