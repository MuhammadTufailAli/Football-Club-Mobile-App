import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import React, {useState, useContext} from 'react';

//importing Validation labiries
import {Formik} from 'formik';
import * as Yup from 'yup';

//importing Image picker
import ImagePicker from 'react-native-image-crop-picker';

//import Context Api
import CartProvider from '../ContextApi/contextApi';

//importing axios
import axios from 'axios';

//importing port
import port from '../Port/Port';

//Importing DropDown
import DropDownPicker from 'react-native-dropdown-picker';

//Asyncstorage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Importing Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//Import FontColor
import {Font, Commonstyles} from '../Font/Font';

const SignupScreen = ({navigation, route}) => {
  const User = route.params?.user;

  const [notShowPassword, SetnotShowPassword] = useState(true);
  const [notShowConfirmPassword, SetnotShowConfirmPassword] = useState(true);
  var [feeSlip, setFeeSlip] = useState('');
  const [cartmodalVisible, setcartModalVisible] = useState(false);
  const {userdetails, setuserdetails, setToken} = useContext(CartProvider);

  const [open2, setOpen2] = useState(false);
  const [Gender, setGender] = useState('');
  const [items2, setItems2] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);

  //Regex for phone number
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  // Checking Validation
  if (User === 'Parent') {
    var validationSchema = Yup.object().shape({
      email: Yup.string()
        .required('Email Address is Required')
        .email('Please enter valid email'),
      Childemail: Yup.string()
        .required('Child Email Address is Required')
        .email('Please enter valid email'),
      password: Yup.string()
        .required('Password is Required')
        .min(6, 'Password Should be greater than 6 letters'),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match',
      ),
      name: Yup.string().required('User must have a name'),

      PhoneNumber: Yup.string()
        .required('Phone Number is required')
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(10, 'too short')
        .max(11, 'too long'),
    });
  } else {
    var validationSchema = Yup.object().shape({
      email: Yup.string()
        .required('Email Address is Required')
        .email('Please enter valid email'),

      password: Yup.string()
        .required('Password is Required')
        .min(6, 'Password Should be greater than 6 letters'),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match',
      ),
      name: Yup.string().required('User must have a name'),

      PhoneNumber: Yup.string()
        .required('Phone Number is required')
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(10, 'too short')
        .max(11, 'too long'),
    });
  }

  //Uploading Photo to cloudnary
  const handleUploadFront = async image => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'MuhammadTufailAli'),
      data.append('cloud_name', 'vehiclebuddy');

    fetch('https://api.cloudinary.com/v1_1/vehiclebuddy/image/upload', {
      method: 'post',
      body: data,
    })
      .then(res => res.json())
      .then(data => {
        var newUrl = data.url.slice(0, 4) + 's' + data.url.slice(4);
        console.log(newUrl);
        setFeeSlip(newUrl);
      });
  };

  //Image picker to pickimage
  const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      compressImageQuality: 0.8,
      maxFiles: 10,
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(response => {
        let imageList = {
          filename: response.filename,
          path: response.path,
          data: response.data,
        };

        var prefix = Math.random();
        let newfile = {
          uri: imageList.path,
          type: `${prefix}/${imageList.path.split('.')[2]}`,
          name: `${prefix}.${imageList.path.split('.')[2]}`,
        };

        handleUploadFront(newfile);
      })
      .catch(e => console.log('error', e.message));
  };

  //Same axios call sa signup bhi ho raha or admin ko call bhi ja rahi ha
  const handleSignUp = async data => {
    if (User === 'Parent') {
      if (Gender === '') {
        alert('Select Gender');
      } else {
        var userData = {
          email: data?.email,
          childEmail: data?.Childemail,
          password: data?.password,
          name: data?.name,
          confirmPassword: data?.confirmPassword,
          role: route.params?.user,
          active: 'active',
          gender: Gender,

          phone: data?.PhoneNumber,
        };

        try {
          const result = await axios.post(
            `${port.herokuPort}/users/ParentSignup`,
            userData,
          );
          try {
            //setting async storage
            const obj = {token: result.data.token, user: User};
            const jsonValue = JSON.stringify(obj);
            await AsyncStorage.setItem('@token', jsonValue);
            console.log(result.data.data.newUser);
            setuserdetails(result.data.data.newUser);
            setToken(result.data.token);
          } catch (e) {
            console.log(e.response);
          }
        } catch (err) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }
      }
    } else {
      if (feeSlip === '') {
        alert('Please add Fee Slip Photos');
      } else {
        var userData = {
          email: data?.email,
          password: data?.password,
          name: data?.name,
          confirmPassword: data?.confirmPassword,
          role: route.params?.user,
          active: 'pending',
          FeeSlipPhoto: feeSlip,
          phone: data?.PhoneNumber,
          height: null,
        };

        try {
          const result = await axios.post(
            `${port.herokuPort}/users/signup`,
            userData,
          );
          setcartModalVisible(true);
        } catch (err) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }
      }
    }
  };
  return (
    <ScrollView style={styles.Container}>
      {/* Model to show req is sent to admin */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartmodalVisible}
        onRequestClose={() => {
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
              <Text style={Commonstyles.TextWhiteMembers}>
                An email will be sent to you after admin approve your profile.
                Plase keep patience!
              </Text>
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
      {/* Logo */}
      <SafeAreaView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 70,
        }}>
        <Text style={Commonstyles.LogoWhite}>LOGO</Text>
      </SafeAreaView>

      <SafeAreaView
        style={{
          marginLeft: 15,
          marginRight: 15,
          marginTop: 5,
          height: 100,
        }}>
        <Text style={Commonstyles.HeadingWhite}>Create Account </Text>
        <Text style={Commonstyles.greyText}>Create account to register</Text>
      </SafeAreaView>

      {/* Formik */}
      <Formik
        validationSchema={validationSchema}
        initialValues={{email: '', password: ''}}
        onSubmit={values => {
          if (User === 'Parent') {
            const obj = {
              name: values.name,
              password: values.password,
              confirmPassword: values.confirmPassword,
              email: values.email,
              Childemail: values.Childemail,
              PhoneNumber: values.PhoneNumber,
            };
            handleSignUp(obj);
          } else {
            const obj = {
              name: values.name,
              password: values.password,
              confirmPassword: values.confirmPassword,
              email: values.email,

              PhoneNumber: values.PhoneNumber,
            };
            handleSignUp(obj);
          }
        }}>
        {({handleChange, handleSubmit, values, errors, isValid}) => (
          <>
            {/* TextInput */}
            <SafeAreaView
              style={{
                marginLeft: 15,
                marginRight: 15,
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <TextInput
                name="name"
                style={Commonstyles.inputText}
                placeholder="Enter Name"
                placeholderTextColor={Font.greyText}
                onChangeText={handleChange('name')}
              />

              <FontAwesome
                name={'user-circle'}
                size={26}
                color={'white'}
                style={{
                  position: 'absolute',
                  right: 10,
                }}
              />
            </SafeAreaView>
            {errors.name && (
              <Text style={Commonstyles.warningText}>{errors.name}</Text>
            )}

            <SafeAreaView
              style={{
                marginLeft: 15,
                marginRight: 15,
                marginTop: 15,
                justifyContent: 'center',
              }}>
              <TextInput
                secureTextEntry={notShowPassword}
                name="password"
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
                <Entypo name={'eye-with-line'} size={26} color={'white'} />
              </TouchableOpacity>
            </SafeAreaView>
            {errors.password && (
              <Text style={Commonstyles.warningText}>{errors.password}</Text>
            )}

            <SafeAreaView
              style={{
                marginLeft: 15,
                marginRight: 15,
                marginTop: 15,
                justifyContent: 'center',
              }}>
              <TextInput
                secureTextEntry={notShowConfirmPassword}
                name="confirmPassword"
                style={Commonstyles.inputText}
                placeholder="Confirm Password"
                placeholderTextColor={Font.greyText}
                // value={values.email}
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
            </SafeAreaView>
            {errors.confirmPassword && (
              <Text style={Commonstyles.warningText}>
                {errors.confirmPassword}
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
            </SafeAreaView>
            {errors.email && (
              <Text style={Commonstyles.warningText}>{errors.email}</Text>
            )}
            {User === 'Parent' ? (
              <View>
                <SafeAreaView
                  style={{
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 15,
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    name="Childemail"
                    style={Commonstyles.inputText}
                    placeholder="Enter Child Email"
                    placeholderTextColor={Font.greyText}
                    onChangeText={handleChange('Childemail')}
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
                </SafeAreaView>
                {errors.Childemail && (
                  <Text style={Commonstyles.warningText}>
                    {errors.Childemail}
                  </Text>
                )}
              </View>
            ) : null}

            <SafeAreaView
              style={{
                marginLeft: 15,
                marginRight: 15,
                marginTop: 15,
                justifyContent: 'center',
              }}>
              <TextInput
                name="PhoneNumber"
                style={Commonstyles.inputText}
                placeholder="Enter Phone"
                placeholderTextColor={Font.greyText}
                keyboardType="numeric"
                onChangeText={handleChange('PhoneNumber')}
              />
              <FontAwesome
                name={'phone-square'}
                size={26}
                color={'white'}
                style={{
                  position: 'absolute',
                  right: 10,
                }}
              />
            </SafeAreaView>
            {errors.PhoneNumber && (
              <Text style={Commonstyles.warningText}>{errors.PhoneNumber}</Text>
            )}

            {User === 'Parent' ? (
              <SafeAreaView
                style={{
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 15,
                  marginBottom: -30,
                  justifyContent: 'center',
                }}>
                <DropDownPicker
                  style={{
                    backgroundColor: Font.grey,
                    height: 63,
                  }}
                  placeholderStyle={Commonstyles?.TextWhite12300}
                  arrowIconStyle={{
                    color: 'white',
                  }}
                  labelStyle={Commonstyles?.TextWhite12300}
                  textStyle={Commonstyles?.TextWhite12300}
                  dropDownContainerStyle={{
                    backgroundColor: Font.grey,
                  }}
                  containerStyle={{
                    width: '100%',
                    height: 80,
                  }}
                  maxHeight={80}
                  placeholder="Gender"
                  disableBorderRadius={true}
                  showArrowIcon={true}
                  showTickIcon={true}
                  open={open2}
                  value={Gender}
                  items={items2}
                  setOpen={setOpen2}
                  setValue={setGender}
                  setItems={setItems2}
                />
              </SafeAreaView>
            ) : null}

            {User === 'Player' ? (
              <View>
                <TouchableOpacity onPress={openImagePicker}>
                  <View pointerEvents="none">
                    <SafeAreaView
                      style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 15,
                        justifyContent: 'center',
                      }}>
                      <TextInput
                        style={Commonstyles.inputText}
                        placeholder="Select File"
                        placeholderTextColor={Font.greyText}
                      />
                      <Entypo
                        name={'attachment'}
                        size={23}
                        color={'white'}
                        style={{
                          position: 'absolute',
                          right: 10,
                        }}
                      />
                    </SafeAreaView>
                  </View>
                </TouchableOpacity>
                {feeSlip === '' ? null : (
                  <View>
                    <Text style={Commonstyles.UploadText}>
                      Image Uploaded successfully
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

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
                  isValid ? Commonstyles.ButtonGreen : Commonstyles.ButtonGrey
                }
                onPress={handleSubmit}>
                <Text style={Commonstyles.TextWhite}>Register</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </>
        )}
      </Formik>

      <SafeAreaView
        style={{
          marginLeft: 15,
          marginRight: 15,
          marginTop: 15,
        }}>
        <TouchableOpacity
          style={Commonstyles.ButtonGrey}
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}>
          <Text style={Commonstyles.TextWhite}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView
        style={{
          marginLeft: 15,
          marginRight: 15,
          marginTop: 25,
          alignItems: 'center',
        }}></SafeAreaView>

      {/* Other Login Buttons */}

      <View style={{alignItems: 'center', marginTop: 10, marginBottom: 10}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}>
          <Text style={Commonstyles.TextGrey}>
            Already have an account?
            <Text style={Commonstyles.TextWhite}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Font.black,
  },
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
    height: 300,
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
