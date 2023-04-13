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

import Loader from '../../../Loader/Loader';
//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const ShopSearch = ({navigation}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cond, setCondition] = useState(true);
  const [Category, setCategory] = useState('All');
  const [dataFromBackend, setDataFromBackend] = useState([]);
  const [products, setProducts] = useState([]);
  const [ProductArray, SetProductArray] = useState([
    {
      ProductImage: 'https://wallpaperaccess.com/full/1597754.jpg',
      Title: 'Nike Mercurial',
      Quantity: 5,
      Price: 250.63,
      description:
        'This is the best product in our shop it is top selling shoes. It is very comfortable and relaxing. you will love to buy it',
      category: 'Shoes',
      size: 'P3-4354',
    },
    {
      ProductImage: 'https://wallpaperaccess.com/full/1597754.jpg',
      Title: 'Nike Mercurial',
      Quantity: 5,
      Price: 250.63,
      description:
        'This is the best product in our shop it is top selling shoes. It is very comfortable and relaxing. you will love to buy it',

      category: 'Shoes',
      size: 'P3-4354',
    },
    {
      ProductImage: 'https://wallpaperaccess.com/full/1597754.jpg',
      Title: 'Service',
      Quantity: 5,
      Price: 250.63,
      description:
        'This is the best product in our shop it is top selling shoes. It is very comfortable and relaxing. you will love to buy it',

      category: 'Shoes',
      size: 'P3-4354',
    },
    {
      ProductImage: 'https://wallpaperaccess.com/full/1597754.jpg',
      Title: 'Bata',
      Quantity: 5,
      Price: 250.63,
      description:
        'This is the best product in our shop it is top selling shoes. It is very comfortable and relaxing. you will love to buy it',

      category: 'Shoes',
      size: 'P3-4354',
    },
    {
      ProductImage: 'https://wallpaperaccess.com/full/1597754.jpg',
      Title: 'Nike Mercurial',
      Quantity: 5,
      Price: 250.63,
      description:
        'This is the best product in our shop it is top selling shoes. It is very comfortable and relaxing. you will love to buy it',

      category: 'Shoes',
      size: 'P3-4354',
    },
    {
      ProductImage: 'https://wallpaperaccess.com/full/1597754.jpg',
      Title: 'Gucci',
      Quantity: 5,
      Price: 250.63,
      description:
        'This is the best product in our shop it is top selling shoes. It is very comfortable and relaxing. you will love to buy it',

      category: 'Shoes',
      size: 'P3-4354',
    },
  ]);
  const [ProductArrayToShow, SetProductArrayToShow] = useState([]);

  //Get products
  const getProducts = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/itemcategory/GetAllItemCategories`,
      );
      const arr = [];

      const allProducts = result.data.data.map(data => {
        data?.Item.map(data => {
          arr.push(data);
        });
      });

      var Data = result.data.data;
      setProducts(arr);
      SetProductArrayToShow(arr);
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
    getProducts();
  }, []);
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
          alignItems: 'center',
        }}>
        {/* Drawer Button and heading */}

        {/* Search bar */}
        <View style={{marginLeft: 15}}>
          <TextInput
            name="email"
            style={styles.inputText}
            placeholder="Search By Name"
            placeholderTextColor={Font.greyText}
            onChangeText={text => {
              text = text.toLowerCase();
              SetProductArrayToShow(
                products?.filter(data => {
                  var user = data.productname.toLowerCase();

                  if (user.includes(text)) {
                    return data;
                  }
                }),
              );
            }}
            keyboardType="email-address"
          />
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

      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View>
          {/* Categories */}
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
                        SetProductArrayToShow(item?.Item);
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

          {products.length === 0 ? (
            <View>
              <Text style={Commonstyles?.TextGreyLight}>No Product Yet</Text>
            </View>
          ) : (
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 60}}
                data={ProductArrayToShow}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        borderRadius: 10,
                        margin: 15,
                        marginTop: 10,
                        flexDirection: 'row',
                        flex: 1,
                      }}>
                      <Image
                        source={{
                          uri: item?.coverphoto,
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
                          style={{
                            marginLeft: 10,
                            justifyContent: 'space-between',
                          }}>
                          <View>
                            <Text style={Commonstyles?.TextGreen14500}>
                              {item?.productname}
                            </Text>
                            <Text style={Commonstyles?.TextGreysmallmini}>
                              {item?.quantity > 0 ? 'In Stock' : 'Out of stock'}
                            </Text>

                            <Text style={Commonstyles?.TextWhite}>
                              ${item?.price}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginBottom: 5,
                            }}></View>
                        </View>

                        <TouchableOpacity
                          style={{alignSelf: 'flex-end', margin: 5}}>
                          <Entypo
                            name={'dots-three-horizontal'}
                            size={23}
                            color={Font.white}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ShopSearch;

const styles = StyleSheet.create({
  inputText: {
    padding: 10,
    width: 250,
    borderRadius: 10,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: Font.greyText,
  },
});
