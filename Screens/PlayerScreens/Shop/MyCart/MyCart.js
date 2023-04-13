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
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import CartProvider from '../../../ContextApi/contextApi';
import axios from 'axios';
import port from '../../../Port/Port';
import {useIsFocused} from '@react-navigation/native';

import Loader from '../../../Loader/Loader';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const MyCart = ({navigation}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [quantity, setQuantity] = useState();
  const [color, setColor] = useState();
  const [size, setSize] = useState();
  const [cond, setCondition] = useState(true);
  const [cartFromBackend, setCartFromBackendFromBackend] = useState([]);
  const [item, setItem] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [getProductCond, setProductCond] = useState(false);
  const [cartmodalVisible, setcartModalVisible] = useState(false);
  const [TotalBill, setTotalBill] = useState(0);

  const isFocused = useIsFocused();

  //Get Cart products
  const getCartProducts = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/cart/getUserCartProduct/${userdetails?._id}`,
      );

      console.log('--------------');
      console.log(result?.data?.data);
      var bill = 0;

      result?.data?.data?.map(data => {
        var sum = data?.quantity * data?.refOfProduct?.price;
        bill = bill + sum;
      });
      setTotalBill(bill?.toFixed(2));

      setCartFromBackendFromBackend(result?.data?.data);

      setCondition(false);
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  };

  //Update Cart
  const updateCart = async () => {
    const cartData = {
      quantity: quantity,
      size: size,
      color: color,
    };

    try {
      const result = await axios.patch(
        `${port.herokuPort}/cart/updateCart/${item?._id}`,
        cartData,
      );

      setcartModalVisible(false);
      setProductCond(!getProductCond);
    } catch (err) {
      console.log(err.response.message);
    }
  };

  //Delete Selected Product
  const deleteSelectedProduct = async () => {
    try {
      const result = await axios.delete(
        `${port.herokuPort}/cart/deleteCartProduct/${item?._id}`,
      );

      alert('Product removed successfully');
      setProductCond(!getProductCond);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  //Get groups in which player is member
  useEffect(() => {
    isFocused && getCartProducts();
  }, [getProductCond, isFocused]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Font.black}}>
      {/* Edit cart */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartmodalVisible}
        onRequestClose={() => {
          setcartModalVisible(!cartmodalVisible);
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
          }}>
          <View style={styles.modalView2}>
            <View>
              <View
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 0,

                    marginLeft: 45,
                    fontFamily: 'Lexend-Regular',
                    fontWeight: '400',
                  }}></Text>
                <Text style={Commonstyles.TextWhiteMembers}>Edit Cart</Text>

                <Pressable
                  onPress={() => setcartModalVisible(!cartmodalVisible)}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Font.red,
                      marginRight: 15,
                      fontWeight: '600',
                      fontFamily: 'Lexend-Regular',
                    }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
              {/* Product area */}

              <View
                style={{
                  borderRadius: 10,
                  margin: 15,
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <Image
                  source={{
                    uri: item?.refOfProduct?.coverphoto,
                  }}
                  style={{
                    width: 113,
                    height: 95,
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
                        {item?.refOfProduct?.productname}
                      </Text>
                      <Text style={Commonstyles?.TextGreysmallmini}>
                        {item?.refOfProduct?.quantity > 0
                          ? 'In Stock'
                          : 'Out of stock'}
                      </Text>

                      <Text style={Commonstyles?.TextWhite}>
                        ${item?.refOfProduct?.price}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 5}}>
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
                      <View style={{marginLeft: 4, marginRight: 4}}>
                        <Text style={Commonstyles?.TextWhiteCalender}>
                          {quantity}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.quantity}
                        onPress={() => {
                          if (quantity >= item?.refOfProduct?.quantity) {
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
                </View>
              </View>
            </View>
            {/* Select color and size */}
            <View style={{margin: 15, marginRight: 0}}>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item?.refOfProduct?.sizes}
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
              {item?.refOfProduct?.colors.length === 0 ? null : (
                <View style={{marginTop: 15}}>
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={item?.refOfProduct?.colors}
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
            <View style={{marginBottom: 40, alignItems: 'center'}}>
              <TouchableOpacity
                style={Commonstyles.ButtonGreen2}
                onPress={() => {
                  updateCart();
                }}>
                <Text style={Commonstyles.TextWhite}>Update Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Options for cart */}
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
                setcartModalVisible(true);
              }}>
              <Text style={styles.modalText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                deleteSelectedProduct();
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
          <Text style={Commonstyles.LogoWhite}>My Cart</Text>
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
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          {/* List of products in cart */}
          <View style={{flex: 2}}>
            <View style={{margin: 15}}>
              <Text style={Commonstyles?.TextWhiteFeatured}>Products</Text>
            </View>
            {/* FlatList */}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cartFromBackend}
              renderItem={({item, index}) => {
                const Total = item?.quantity * item?.refOfProduct?.price;

                return (
                  <View
                    style={{
                      borderRadius: 10,
                      margin: 15,
                      marginTop: 0,
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <Image
                      source={{
                        uri: item?.refOfProduct?.coverphoto,
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
                            {item?.refOfProduct?.productname}
                          </Text>
                          <Text style={Commonstyles?.TextGreysmallmini}>
                            {item?.refOfProduct?.quantity > 0
                              ? 'In Stock'
                              : 'Out of stock'}
                          </Text>

                          <Text style={Commonstyles?.TextWhite}>
                            ${item?.refOfProduct?.price}
                          </Text>
                          {item?.size?.length === 0 ? null : (
                            <View>
                              <Text style={Commonstyles?.TextGreen14}>
                                {item?.size}
                              </Text>
                            </View>
                          )}
                          {item?.color.length === 0 ? null : (
                            <View
                              style={{
                                height: 20,
                                width: 20,
                                borderRadius: 5,
                                marginTop: 5,

                                alignItems: 'center',
                                justifyContent: 'center',

                                backgroundColor: item?.color.toLowerCase(),
                              }}></View>
                          )}
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          <Text style={Commonstyles?.TextWhiteCalender}>
                            Qty:{' '}
                            <Text style={Commonstyles?.TextGreen14}>
                              {item?.quantity}
                            </Text>
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          setQuantity(item?.quantity);
                          setColor(item?.color);
                          setSize(item?.size);
                          setItem(item);
                          setModalVisible(true);
                        }}
                        style={{alignSelf: 'flex-end', margin: 5}}>
                        <Entypo
                          name={'dots-three-horizontal'}
                          size={23}
                          color={Font.white}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>

          {/* Pay Now */}
          <View
            style={{
              marginTop: 15,
              borderTopWidth: 0.5,
              borderColor: Font.greyText,
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}>
              <Text style={Commonstyles?.TextWGreyMembersName}>Total</Text>
              <Text style={Commonstyles?.TextWGreyMembersName}>
                $ <Text style={Commonstyles?.LogoWhite20500}>{TotalBill}</Text>
              </Text>
            </View>
            <View style={{margin: 15, marginTop: 8}}>
              <TouchableOpacity
                style={Commonstyles.ButtonGreen}
                onPress={() => {
                  navigation.navigate('Checkout', {
                    product: cartFromBackend,
                    TotalCost: TotalBill,
                    from: 'MyCart',
                  });
                  console.log(cartFromBackend);
                }}>
                <Text style={Commonstyles.TextWhite}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyCart;

const styles = StyleSheet.create({
  quantity: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',

    alignItems: 'center',
    backgroundColor: Font.white,
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
  text: {
    color: 'white',

    fontSize: 18,
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
  modalView2: {
    marginTop: 10,
    backgroundColor: Font.grey,
    borderRadius: 15,
    height: '45%',
    width: '100%',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText2: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
});
