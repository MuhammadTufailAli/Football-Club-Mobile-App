import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../../ContextApi/contextApi';
import port from '../../Port/Port';

//importing Validation labiries
import {Formik} from 'formik';
import * as Yup from 'yup';

//import font and design
import {Font, Commonstyles} from '../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const ChangePassword = ({navigation}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cartmodalVisible, setcartModalVisible] = useState(false);
  const [notShowCurrentPassword, SetnotShowCurrentPassword] = useState(true);
  const [notShowNewPassword, SetnotShowNewPassword] = useState(true);
  const [notShowConfirmPassword, SetnotShowConfirmPassword] = useState(true);

  const [CurrentPassword, setCurrentPassword] = useState();

  const [textToShow, setTextToShow] = useState();

  var validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is Required')
      .min(6, 'Password Should be greater than 6 letters'),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match',
    ),
  });

  const updatePassword = async obj => {
    const userCredentials = {
      email: userdetails?.email,
      password: CurrentPassword,
      newpassword: obj?.password,
      confirmPassword: obj?.confirmPassword,
    };

    try {
      const result = await axios.post(
        `${port.herokuPort}/users/UpdatePassword`,
        userCredentials,
      );
      setTextToShow('Password Updated Successfully');
      setcartModalVisible(true);
    } catch (err) {
      console.log(err.response.data.message);
      setTextToShow('Please Enter Correct Password!!!');
      setcartModalVisible(true);
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

      {/* Change password*/}
      <View style={styles.headingStyle}>
        <Text style={Commonstyles?.TextWhiteFeatured}>Change Password</Text>
      </View>

      <View
        style={{
          justifyContent: 'center',
          margin: 15,
          marginBottom: 0,
        }}>
        <TextInput
          name="password"
          secureTextEntry={notShowCurrentPassword}
          style={Commonstyles.inputText}
          placeholder="Current Password"
          placeholderTextColor={Font.greyText}
          onChangeText={data => {
            setCurrentPassword(data);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            SetnotShowCurrentPassword(!notShowCurrentPassword);
          }}
          style={{
            position: 'absolute',
            right: 10,
          }}>
          <Entypo name={'eye-with-line'} size={26} color={'white'} />
        </TouchableOpacity>
      </View>

      <Formik
        validationSchema={validationSchema}
        initialValues={{email: '', password: ''}}
        onSubmit={values => {
          const obj = {
            password: values.password,
            confirmPassword: values.confirmPassword,
          };
          updatePassword(obj);
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
                name="password"
                secureTextEntry={notShowNewPassword}
                style={Commonstyles.inputText}
                placeholder="New Password"
                placeholderTextColor={Font.greyText}
                onChangeText={handleChange('password')}
              />
              <TouchableOpacity
                onPress={() => {
                  SetnotShowNewPassword(!notShowNewPassword);
                }}
                style={{
                  position: 'absolute',
                  right: 10,
                }}>
                <Entypo name={'eye-with-line'} size={26} color={'white'} />
              </TouchableOpacity>
            </View>

            {errors.password && (
              <Text style={Commonstyles.warningText}>{errors.password}</Text>
            )}

            <View
              style={{
                justifyContent: 'center',
                margin: 15,
              }}>
              <TextInput
                name="confirmPassword"
                secureTextEntry={notShowConfirmPassword}
                style={Commonstyles.inputText}
                placeholder="Confirm Password"
                placeholderTextColor={Font.greyText}
                onChangeText={handleChange('confirmPassword')}
              />
              <TouchableOpacity
                onPress={() => {
                  SetnotShowConfirmPassword(!notShowConfirmPassword);
                }}
                style={{
                  position: 'absolute',
                  right: 10,
                }}>
                <Entypo name={'eye-with-line'} size={26} color={'white'} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={Commonstyles.warningText}>
                {errors.confirmPassword}
              </Text>
            )}
            {/* Buttons */}
            <View style={{margin: 15}}>
              <TouchableOpacity
                style={Commonstyles.ButtonGreen}
                onPress={handleSubmit}>
                <Text style={Commonstyles.TextWhite}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default ChangePassword;

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
