import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../../../ContextApi/contextApi';
import port from '../../../Port/Port';

//importing Validation labiries
import {Formik} from 'formik';
import * as Yup from 'yup';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const ChangeEmail = ({navigation}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cartmodalVisible, setcartModalVisible] = useState(false);
  const [CurrentEmail, setCurrentEmail] = useState();

  const [textToShow, setTextToShow] = useState();

  var validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email Address is Required')
      .email('Please enter valid email'),
    Confirmemail: Yup.string()
      .required('Email Address is Required')
      .email('Please enter valid email'),
  });

  const updateEmail = async obj => {
    if (CurrentEmail != userdetails?.email) {
      setTextToShow('Please Enter Correct Email!!!');
      setcartModalVisible(true);
    } else if (obj.email != obj.Confirmemail) {
      setTextToShow('Email and Confirm Email Must Match!!!');
      setcartModalVisible(true);
    } else {
      const userData = {
        email: obj.email,
      };
      try {
        const result = await axios.patch(
          `${port.herokuPort}/users/updateUser/${userdetails?._id}`,
          userData,
        );

        setuserdetails(result.data.data);
        setTextToShow('Email Updated Successfully');
        setcartModalVisible(true);
      } catch (err) {
        console.log(err.response.data.message);
        alert('Error');
      }
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Font.black}}>
      {/* Model to ask for review */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartmodalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setcartModalVisible(!cartmodalVisible);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView3}>
            <TouchableOpacity
              onPress={() => {
                setcartModalVisible(false);
              }}
              style={{
                alignItems: 'flex-end',
                margin: 10,
              }}>
              <Entypo name={'cross'} size={20} color={Font.white} />
            </TouchableOpacity>
            <View
              style={{
                marginTop: 15,
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name={'email'}
                size={38}
                color={'white'}
              />
            </View>
            <View
              style={{
                margin: 20,
                marginBottom: 15,
                alignItems: 'center',
              }}>
              <Text style={Commonstyles.TextWhiteMembers}>{textToShow}</Text>
            </View>

            {/* Buttons */}
            <View style={{margin: 15, alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.ButtonGreen}
                onPress={() => {
                  setcartModalVisible(false);
                }}>
                <Text style={Commonstyles.TextWhite}>Done</Text>
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
              navigation.openDrawer();
            }}>
            <Ionicons
              name={'reorder-three-sharp'}
              size={32}
              color={Font.green}
            />
          </TouchableOpacity>
          <Text style={Commonstyles.LogoWhite}>Settings</Text>
        </View>
        {/* Notification icon */}
        <View
          style={{
            justifyContent: 'center',
            marginRight: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ParentNotification');
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={28}
              color={Font.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headingStyle}>
        <Text style={Commonstyles?.TextWhiteFeatured}>Change Email</Text>
      </View>
      {/* Current Email */}
      <View
        style={{
          justifyContent: 'center',
          margin: 15,
          marginBottom: 0,
        }}>
        <TextInput
          name="email"
          style={Commonstyles.inputText}
          placeholder="Current Email"
          placeholderTextColor={Font.greyText}
          onChangeText={data => {
            setCurrentEmail(data);
          }}
          keyboardType="email-address"
        />
        <MaterialCommunityIcons
          name={'email'}
          size={26}
          color={'white'}
          style={{
            position: 'absolute',
            right: 10,
          }}
        />
      </View>
      <Formik
        validationSchema={validationSchema}
        initialValues={{email: '', password: ''}}
        onSubmit={values => {
          const obj = {
            email: values.email,
            Confirmemail: values.Confirmemail,
          };
          updateEmail(obj);
        }}>
        {({handleChange, handleSubmit, values, errors, isValid}) => (
          <>
            <View
              style={{
                justifyContent: 'center',
                margin: 15,
                marginBottom: 0,
              }}>
              <TextInput
                name="email"
                style={Commonstyles.inputText}
                placeholder="New Email"
                placeholderTextColor={Font.greyText}
                onChangeText={handleChange('email')}
                keyboardType="email-address"
              />
              <MaterialCommunityIcons
                name={'email'}
                size={26}
                color={'white'}
                style={{
                  position: 'absolute',
                  right: 10,
                }}
              />
            </View>
            {errors.email && (
              <Text style={Commonstyles.warningText}>{errors.email}</Text>
            )}

            {/* Confirm Email */}

            <View
              style={{
                justifyContent: 'center',
                margin: 15,
              }}>
              <TextInput
                name="Confirmemail"
                style={Commonstyles.inputText}
                placeholder="Re-type new Email"
                placeholderTextColor={Font.greyText}
                onChangeText={handleChange('Confirmemail')}
                keyboardType="email-address"
              />
              <MaterialCommunityIcons
                name={'email'}
                size={26}
                color={'white'}
                style={{
                  position: 'absolute',
                  right: 10,
                }}
              />
            </View>
            {errors.Confirmemail && (
              <Text style={Commonstyles.warningText}>
                {errors.Confirmemail}
              </Text>
            )}

            {/* Buttons */}
            <View style={{margin: 15}}>
              <TouchableOpacity
                style={Commonstyles.ButtonGreen}
                onPress={handleSubmit}>
                <Text style={Commonstyles.TextWhite}>Update Email</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default ChangeEmail;

const styles = StyleSheet.create({
  headingStyle: {
    paddingLeft: 15,
    paddingBottom: 5,
    marginTop: 15,
    borderBottomWidth: 0.5,
    borderColor: Font.greyText,
  },

  centeredView2: {
    alignItems: 'center',
  },
  centeredView: {},

  modalView3: {
    marginTop: '50%',
    marginBottom: 10,
    backgroundColor: '#333333',
    borderRadius: 26,
    height: 270,
    width: '90%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText3: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  TextColor: {
    color: Font.TextBackground,
  },
  ButtonGreen: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 122,
    height: 37.22,
    backgroundColor: '#1DB954',
    borderRadius: 10,
  },
});
