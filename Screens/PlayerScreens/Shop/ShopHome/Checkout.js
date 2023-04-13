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
  Modal,
} from 'react-native';
import React, {useState, useContext} from 'react';
import valid from 'card-validator';

//importing axios
import axios from 'axios';

//importing port
import port from '../../../Port/Port';
//import Context Api
import CartProvider from '../../../ContextApi/contextApi';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//importing Validation labiries
import {Formik} from 'formik';
import * as Yup from 'yup';
const Checkout = ({navigation, route}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  if (route?.params?.from === 'SingleProduct') {
    console.log('I am in single product checkout');
    var Color = route?.params?.color;
    var Size = route?.params?.size;
    var Product = route?.params?.product;
    var Quantity = route?.params?.quantity;
    var Total = Quantity * Product?.price;
  } else {
    console.log('I am in cart checkout');
    var Product = route?.params?.product;
    var Total = route?.params?.TotalCost;
  }

  // Checking Validation
  const validationSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .min(10, 'Credit Card number is invalid')
      .max(19, 'Credit Card number is invalid')
      .required('Card number is required'),
    expire: Yup.string()
      .test(
        'test-number', // this is used internally by yup
        'Expire Date is invalid', //validation message
        value => valid.expirationDate(value).isValid,
      ) // return true false based on validation
      .required('Expire Date is required'),

    CVV: Yup.string()
      .test(
        'test-number', // this is used internally by yup
        'CVV is invalid', //validation message
        value => valid.cvv(value).isValid,
      ) // return true false based on validation
      .required('CVV is required'),
  });
  const PayMoney = async (cardNumber, expireDate, cvv) => {
    const amount = Total.toString();
    const NewCvv = parseInt(cvv);

    var cardData = {
      cc: cardNumber,
      cvv: NewCvv,
      expire: expireDate,
      amount: amount,
    };

    //Send money to admin ammount
    try {
      const result = await axios.post(
        `${port.herokuPort}/item/PayPayment`,
        cardData,
      );

      if (route?.params?.from === 'SingleProduct') {
        //Generating User Notification
        var OrderData = {
          refOfProduct: Product?._id,
          refOfCustomer: userdetails?._id,
          price: Total,
          quantity: Quantity,
          color: Color,
          size: Size,
          deliveryAddress: deliveryAddress,
        };
        try {
          const result = await axios.post(
            `${port.herokuPort}/CustomerBuyingNotificationRoute/PostNotification`,
            OrderData,
          );

          //Generating Admin Notification
          const UserId = {
            refOfCustomerNotification: result?.data?.data?.doc?._id,
          };

          try {
            const result = await axios.post(
              `${port.herokuPort}/AdminOrderNotification/PostNotification`,
              UserId,
            );

            //update product quantity
            const NewQuantity = Product?.quantity - Quantity;

            const updateQuantity = {
              quantity: NewQuantity,
            };

            try {
              const result = await axios.put(
                `${port.herokuPort}/item/UpdateItem/${Product?._id}`,
                updateQuantity,
              );

              alert('Transaction was sucessfull');
              setModalVisible(false);
            } catch (err) {
              console.log(err.response.data.message);
              alert(err);
            }
          } catch (err) {
            console.log(err);
            alert(err);
          }
        } catch (err) {
          console.log(err);
          alert(err);
        }
      } else {
        var count = 1;
        //sequencey generating user notifications
        Product?.map(async data => {
          //Generating User Notification
          var OrderData = {
            refOfProduct: data?.refOfProduct?._id,
            refOfCustomer: userdetails?._id,
            price: Total,
            quantity: data?.quantity,
            color: data?.color,
            size: data?.size,
            deliveryAddress: deliveryAddress,
          };
          try {
            const result = await axios.post(
              `${port.herokuPort}/CustomerBuyingNotificationRoute/PostNotification`,
              OrderData,
            );

            //Generating Admin Notification
            const UserId = {
              refOfCustomerNotification: result?.data?.data?.doc?._id,
            };

            try {
              const result = await axios.post(
                `${port.herokuPort}/AdminOrderNotification/PostNotification`,
                UserId,
              );

              //update product quantity
              const NewQuantity = data?.refOfProduct?.quantity - data?.quantity;

              const updateQuantity = {
                quantity: NewQuantity,
              };

              try {
                const result = await axios.put(
                  `${port.herokuPort}/item/UpdateItem/${data?.refOfProduct?._id}`,
                  updateQuantity,
                );
                try {
                  const result = await axios.delete(
                    `${port.herokuPort}/cart/deleteCartProduct/${data?._id}`,
                  );

                  if (Product.length === count) {
                    alert('Transaction was sucessfull');
                  } else {
                    count++;
                  }
                  setModalVisible(false);
                } catch (err) {
                  console.log(err.response.data);
                  alert('Error');
                }
              } catch (err) {
                console.log(err.response.data.message);
                alert(err);
              }
            } catch (err) {
              console.log(err);
              alert(err);
            }
          } catch (err) {
            console.log(err);
            alert(err);
          }
        });
      }
    } catch (err) {
      console.log(err);
      alert('Transaction failed Please try again!!!');
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: Font.black}}>
      {/* Enter Card Info*/}
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
              }}>
              <Entypo
                name={'cross'}
                size={20}
                color={Font.white}
                style={{marginLeft: 10, marginTop: 8}}
              />
            </TouchableOpacity>
            {/* Text Area */}
            <View style={{margin: 10, marginLeft: 15}}>
              <Text style={Commonstyles?.TextWhiteProfileUserName}>
                Add your payment information
              </Text>
            </View>

            {/* Formik */}
            <Formik
              validationSchema={validationSchema}
              initialValues={{email: '', password: ''}}
              onSubmit={values => {
                PayMoney(values.cardNumber, values.expire, values.CVV);
              }}>
              {({handleChange, handleSubmit, values, errors, isValid}) => (
                <>
                  {/* TextInput */}
                  <View style={{marginLeft: 15}}>
                    <Text style={Commonstyles?.TextGrey12300}>
                      Card information
                    </Text>
                  </View>

                  <SafeAreaView
                    style={{
                      marginLeft: 15,
                      marginRight: 15,
                      marginTop: 8,
                      justifyContent: 'center',
                    }}>
                    <TextInput
                      name="cardNumber"
                      style={Commonstyles.inputTextBlack}
                      placeholder="Card number"
                      placeholderTextColor={Font.greyText}
                      onChangeText={handleChange('cardNumber')}
                    />

                    <Entypo
                      name={'credit-card'}
                      size={26}
                      color={'white'}
                      style={{
                        position: 'absolute',
                        right: 10,
                      }}
                    />
                  </SafeAreaView>
                  {errors.cardNumber && (
                    <Text style={Commonstyles.warningText}>
                      {errors.cardNumber}
                    </Text>
                  )}

                  <SafeAreaView
                    style={{
                      marginLeft: 15,
                      marginRight: 15,
                      marginTop: 15,
                      justifyContent: 'center',
                    }}>
                    <TextInput
                      maxLength={4}
                      name="expire"
                      style={Commonstyles.inputTextBlack}
                      placeholder="MMYY"
                      placeholderTextColor={Font.greyText}
                      onChangeText={handleChange('expire')}
                    />

                    <MaterialCommunityIcons
                      style={{
                        position: 'absolute',
                        right: 10,
                      }}
                      name={'card-bulleted'}
                      size={26}
                      color={'white'}
                    />
                  </SafeAreaView>
                  {errors.expire && (
                    <Text style={Commonstyles.warningText}>
                      {errors.expire}
                    </Text>
                  )}

                  <SafeAreaView
                    style={{
                      marginLeft: 15,
                      marginRight: 15,
                      marginTop: 15,
                      justifyContent: 'center',
                    }}>
                    <TextInput
                      maxLength={3}
                      name="CVV"
                      style={Commonstyles.inputTextBlack}
                      placeholder="CVV"
                      placeholderTextColor={Font.greyText}
                      // value={values.email}
                      onChangeText={handleChange('CVV')}
                    />

                    <AntDesign
                      style={{
                        position: 'absolute',
                        right: 10,
                      }}
                      name={'creditcard'}
                      size={26}
                      color={'white'}
                    />
                  </SafeAreaView>
                  {errors.CVV && (
                    <Text style={Commonstyles.warningText}>{errors.CVV}</Text>
                  )}

                  {/* Buttons */}
                  <SafeAreaView
                    style={{
                      marginLeft: 15,
                      marginRight: 15,
                      marginTop: 30,
                    }}>
                    <TouchableOpacity
                      disabled={!isValid}
                      style={
                        isValid
                          ? Commonstyles.ButtonBlue
                          : Commonstyles.ButtonGrey
                      }
                      onPress={handleSubmit}>
                      <Text style={Commonstyles.TextWhite}>Pay ${Total}</Text>
                    </TouchableOpacity>
                  </SafeAreaView>
                </>
              )}
            </Formik>
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
          <Text style={Commonstyles.LogoWhite}>Checkout</Text>
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

      {/* Delivery Address */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles?.TextWhiteFeatured}>Delivery Address</Text>

        {/* TextInput */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: 15,
          }}>
          <TextInput
            name="email"
            style={Commonstyles.inputText}
            placeholder="Enter Address"
            placeholderTextColor={Font.greyText}
            onChangeText={data => {
              console.log(data);
              setDeliveryAddress(data);
            }}
          />
          <Ionicons
            name={'location-sharp'}
            size={26}
            color={'white'}
            style={{
              position: 'absolute',
              right: 10,
            }}
          />
        </View>
      </View>

      {/* My Cart */}
      <View style={{margin: 15}}>
        <Text style={Commonstyles?.TextWhiteFeatured}>My Cart</Text>
        {route?.params?.from === 'SingleProduct' ? (
          <TouchableOpacity style={{marginTop: 10, borderRadius: 10}}>
            <ImageBackground
              source={{
                uri: Product?.coverphoto,
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
                  {Product?.productname}
                </Text>
                <Text style={Commonstyles?.TextGreysmallmini}>
                  {Product?.quantity > 0 ? 'In Stock' : 'Out of stock'}
                </Text>
              </View>
              <View
                style={{
                  margin: 8,

                  alignSelf: 'flex-end',
                }}>
                <Text style={Commonstyles?.TextWhite}>${Product?.price}</Text>
                <Text style={Commonstyles?.TextWhitesmallmini300}>
                  Qty:{' '}
                  <Text style={Commonstyles?.TextGreensmallmini}>
                    {Quantity}
                  </Text>
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={Product}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{marginTop: 10, marginRight: 8, borderRadius: 10}}>
                  <ImageBackground
                    source={{
                      uri: item?.refOfProduct?.coverphoto,
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
                        {item?.refOfProduct?.productname}
                      </Text>
                      <Text style={Commonstyles?.TextGreysmallmini}>
                        {item?.refOfProduct?.quantity > 0
                          ? 'In Stock'
                          : 'Out of stock'}
                      </Text>
                    </View>
                    <View
                      style={{
                        margin: 8,

                        alignSelf: 'flex-end',
                      }}>
                      <Text style={Commonstyles?.TextWhite}>
                        ${item?.refOfProduct?.price}
                      </Text>
                      <Text style={Commonstyles?.TextWhitesmallmini300}>
                        Qty:{' '}
                        <Text style={Commonstyles?.TextGreensmallmini}>
                          {item?.quantity}
                        </Text>
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {/* Pay Now */}
      <View
        style={{
          marginTop: 15,
          borderTopWidth: 0.5,
          borderColor: Font.greyText,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 15,
          }}>
          <Text style={Commonstyles?.TextWGreyMembersName}>Total</Text>
          <Text style={Commonstyles?.TextWGreyMembersName}>
            $ <Text style={Commonstyles?.LogoWhite20500}>{Total}</Text>
          </Text>
        </View>
        <View style={{margin: 15}}>
          <TouchableOpacity
            disabled={deliveryAddress?.length === 0}
            style={
              deliveryAddress?.length === 0
                ? Commonstyles.ButtonGrey
                : Commonstyles.ButtonGreen
            }
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text style={Commonstyles.TextWhite}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    height: '60%',

    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
