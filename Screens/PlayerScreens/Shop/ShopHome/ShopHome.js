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
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import CartProvider from '../../../ContextApi/contextApi';
import port from '../../../Port/Port';
import {useIsFocused} from '@react-navigation/native';

import Loader from '../../../Loader/Loader';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ShopHome = ({navigation}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const isFocused = useIsFocused();
  const [Category, setCategory] = useState('All');
  const [cond, setCondition] = useState(true);
  const [dataFromBackend, setDataFromBackend] = useState([]);
  const [products, setProducts] = useState([]);

  //Get products
  const getProducts = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/itemcategory/GetAllItemCategories`,
      );

      const arr = [];
      console.log(result.data.data);
      const allProducts = result.data.data.map(data => {
        data?.Item.map(data => {
          arr.push(data);
        });
      });

      var Data = result.data.data;
      setProducts(arr);
      Data.unshift({name: 'All', Item: arr});
      setDataFromBackend(Data);

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  //Get product from backend
  useEffect(() => {
    isFocused && getProducts();
  }, [isFocused]);

  const Products = ({products}) => {
    return (
      <View>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={products}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{marginRight: 8, borderRadius: 10}}
                onPress={() => {
                  navigation.navigate('SingleProduct', {
                    product: item,
                  });
                }}>
                <ImageBackground
                  source={{
                    uri: item?.coverphoto,
                  }}
                  resizeMode="cover"
                  imageStyle={{borderRadius: 10}}
                  style={{
                    width: 158,
                    height: 158,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{margin: 8}}>
                    <Text style={Commonstyles?.TextGreen}>
                      {item?.productname}
                    </Text>
                    <Text style={Commonstyles?.TextGreysmallmini}>
                      {item?.quantity > 0 ? 'In Stock' : 'Out of stock'}
                    </Text>
                  </View>
                  <View style={{margin: 8, alignItems: 'flex-end'}}>
                    <Text style={Commonstyles?.TextWhite}>${item?.price}</Text>
                  </View>
                </ImageBackground>
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
          <Text style={Commonstyles.LogoWhite}>Store</Text>
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
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View>
          <View style={{margin: 15, marginRight: 0}}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={dataFromBackend}
              renderItem={({item, index}) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setCategory(item.name);
                        setProducts(item?.Item);
                      }}
                      style={{
                        height: 38,
                        width: 77,
                        borderRadius: 5,
                        marginRight: 8,

                        alignItems: 'center',
                        justifyContent: 'center',

                        borderWidth: 1,
                        borderColor:
                          item.name === Category ? Font.green : Font.greyText,
                      }}>
                      <Text style={Commonstyles?.TextWhite}>{item?.name}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          {/* Showing Selected category */}
          <Products products={products} />

          {/* Featured Products */}
          <View style={{margin: 15}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={Commonstyles?.TextWhiteFeatured}>
                Featured Proucts
              </Text>
              <TouchableOpacity
                style={{
                  width: 89,
                  height: 35,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Font.greyText,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={Commonstyles?.TextGrey12300}>More</Text>
              </TouchableOpacity>
            </View>

            {/* Product array */}
            <View style={{marginTop: 15}}>
              {products?.length === 0 ? (
                <View>
                  <Text style={Commonstyles?.TextGreyLight}>
                    No Product Yet
                  </Text>
                </View>
              ) : (
                <FlatList
                  columnWrapperStyle={{
                    flex: 1,
                    justifyContent: 'space-around',
                  }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 705}}
                  numColumns={2}
                  data={products}
                  renderItem={({item, index}) => {
                    if (item?.sizes.length > 3) {
                      var Sizes = item.sizes.slice(1, 4);
                    } else {
                      var Sizes = item.sizes;
                    }
                    return (
                      <TouchableOpacity
                        style={{borderRadius: 10, margin: 5}}
                        onPress={() => {
                          navigation.navigate('SingleProduct', {
                            product: item,
                          });
                        }}>
                        <ImageBackground
                          source={{
                            uri: item?.coverphoto,
                          }}
                          resizeMode="cover"
                          imageStyle={{borderRadius: 10}}
                          style={{
                            width: 158,
                            height: 213,
                            justifyContent: 'space-between',
                          }}>
                          <View style={{margin: 12}}>
                            <Text style={Commonstyles?.TextWhitesmallmini300}>
                              {item?.quantity > 0 ? 'In Stock' : 'Out of stock'}
                            </Text>
                          </View>
                          <View style={{margin: 8}}>
                            <Text style={Commonstyles?.TextWhite500}>
                              {item?.productname}
                            </Text>
                            <Text style={Commonstyles?.TextGreensmallmini}>
                              {Sizes?.map(size => {
                                return size + ' ';
                              })}
                            </Text>
                            <Text style={Commonstyles?.TextWhite}>
                              ${item?.price}
                            </Text>
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ShopHome;

const styles = StyleSheet.create({});
