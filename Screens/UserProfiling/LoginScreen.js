import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, {useState, useContext} from 'react';

//Asyncstorage
import AsyncStorage from '@react-native-async-storage/async-storage';

//importing Validation labiries
import {Formik} from 'formik';
import * as Yup from 'yup';

//importing axios
import axios from 'axios';

//importing port
import port from '../Port/Port';

//import Context Api
import CartProvider from '../ContextApi/contextApi';

//Importing Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
//Import FontColor
import {Font, Commonstyles} from '../Font/Font';

const LoginScreen = ({navigation, route}) => {
  const user = route?.params?.user;
  const [notShowPassword, SetnotShowPassword] = useState(true);
  const {userdetails, setuserdetails, setToken} = useContext(CartProvider);

  // Checking Validation
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email Address is Required')
      .email('Please enter valid email'),
    // password: Yup.string()
    //   .required('Password is Required')
    //   .min(6, 'Password Should be greater than 6 letters'),
  });

  //Handling login

  const handleLogin = async (email, password) => {
    const userCredentials = {
      email: email,
      password: password,
    };

    try {
      const result = await axios.post(
        `${port.herokuPort}/users/signin`,
        userCredentials,
      );

      if (result.data.data.user.active === 'active') {
        if (result.data.data.user.role === 'Player') {
          if (user === 'Player') {
            try {
              //setting async storage
              const obj = {token: result.data.token, user: user};
              const jsonValue = JSON.stringify(obj);
              await AsyncStorage.setItem('@token', jsonValue);
            } catch (e) {
              console.log(e.response);
            }

            //updating user login status
            const loggedIn = {
              isLoggedIn: true,
            };
            const userId = result.data.data.user?._id;
            try {
              const result = await axios.put(
                `${port.herokuPort}/users/updateUser/${userId}`,
                loggedIn,
              );
              console.log(result.data.data);

              setuserdetails(result.data.data);
            } catch (err) {
              console.log(err.response.data.message);
            }
            //Setting context api states

            setToken(result.data.token);
          } else {
            alert(err.response.data.message);
          }
        } else if (result.data.data.user.role === 'Parent') {
          if (user === 'Parent') {
            //setting async storage

            try {
              const obj = {token: result.data.token, user: user};
              const jsonValue = JSON.stringify(obj);
              await AsyncStorage.setItem('@token', jsonValue);
            } catch (e) {
              console.log(e.response.data.message);
            }

            //updating user login status
            const loggedIn = {
              isLoggedIn: true,
            };

            const userId = result.data.data.user?._id;
            try {
              const result = await axios.put(
                `${port.herokuPort}/users/updateUser/${userId}`,
                loggedIn,
              );

              setuserdetails(result.data.data);
            } catch (err) {
              console.log(err);
            }
            //Setting context api states

            setToken(result.data.token);
          } else {
            alert(err.response.data.message);
          }
        }
      } else {
        alert('Your request is in ' + result.data.data.user.active + ' state');
      }
    } catch (err) {
      // alert(err.response.data.message);
      console.log('ii crossed this step-----------');
      console.log(err.response);
      alert('Incorrect email or password :(');
      // setCredentialValidation(err.response.data.message);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.TopContainer}>
          <View style={styles.Logo}>
            <Text style={Commonstyles.LogoWhite}>LOGO</Text>
          </View>
          <View style={styles.Form}>
            <View style={{height: 100}}>
              <Text style={Commonstyles.HeadingWhite}>Welcome Back</Text>
              <Text style={Commonstyles.greyText}>Login to continue using</Text>
            </View>

            <Formik
              validationSchema={validationSchema}
              initialValues={{email: '', password: ''}}
              onSubmit={values => {
                handleLogin(values.email, values.password);
              }}>
              {({handleChange, handleSubmit, values, errors, isValid}) => (
                <>
                  {/* TextInput */}
                  <View
                    style={{
                      justifyContent: 'center',
                      marginTop: 15,
                    }}>
                    <TextInput
                      name="email"
                      style={Commonstyles.inputText}
                      placeholder="Enter Email"
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

                  <View
                    style={{
                      justifyContent: 'center',
                      marginTop: 15,
                    }}>
                    <TextInput
                      name="password"
                      secureTextEntry={notShowPassword}
                      style={Commonstyles.inputText}
                      placeholder="Enter Password"
                      placeholderTextColor={Font.greyText}
                      onChangeText={handleChange('password')}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        SetnotShowPassword(!notShowPassword);
                      }}
                      style={{
                        position: 'absolute',
                        right: 10,
                      }}>
                      <Entypo
                        name={'eye-with-line'}
                        size={26}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={Commonstyles.warningText}>
                      {errors.password}
                    </Text>
                  )}
                  <View style={{marginTop: 10, alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => {
                        alert('Coming Soon');
                      }}>
                      <Text style={Commonstyles.TextGreysmall}>
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Buttons */}
                  <View style={{marginTop: 20}}>
                    <TouchableOpacity
                      disabled={!isValid}
                      style={
                        isValid
                          ? Commonstyles.ButtonGreen
                          : Commonstyles.ButtonGrey
                      }
                      onPress={handleSubmit}>
                      <Text style={Commonstyles.TextWhite}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>

            <View style={{marginTop: 15}}>
              <TouchableOpacity
                style={Commonstyles.ButtonGrey}
                onPress={() => {
                  navigation.navigate('SignupScreen', {user: user});
                }}>
                <Text style={Commonstyles.TextWhite}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.OtherMethod}>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SignupScreen', {user: user});
                }}>
                <Text style={Commonstyles.TextGrey}>
                  Don't have an account?
                  <Text style={Commonstyles.TextWhite}> Register</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TopContainer: {
    flex: 1,
    backgroundColor: Font.black,
  },
  Logo: {
    height: 70,

    alignItems: 'center',
    justifyContent: 'center',
  },
  LogoText: {
    fontFamily: Font.LogoFamily,
    fontSize: Font.LogoSize,
    fontWeight: Font.LogoWeight,
    color: Font.white,
  },
  Form: {
    marginLeft: 15,
    marginRight: 15,
  },
  OtherMethod: {
    marginLeft: 15,
    marginRight: 15,
  },
});
