import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, {useState} from 'react';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Setting = ({navigation}) => {
  const [appNotification, setAppNotification] = useState(false);
  const toggleSwitch = () =>
    setAppNotification(previousState => !previousState);
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

      {/* Contact Details */}
      <View style={styles.headingStyle}>
        <Text style={Commonstyles?.TextWhite18600}>Contact Details</Text>
      </View>
      <View>
        {/* Email */}
        <TouchableOpacity
          style={styles.details}
          onPress={() => {
            navigation.navigate('ChangeEmail');
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconView}>
              <MaterialCommunityIcons
                name={'email'}
                size={22}
                color={Font.white}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={Commonstyles.TextWhiteCalender}>Email Address</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => {
              navigation.navigate('ChangeEmail');
            }}>
            <AntDesign name={'right'} size={20} color={Font.white} />
          </TouchableOpacity>
        </TouchableOpacity>
        {/* Phone */}
        <TouchableOpacity
          style={styles.details}
          onPress={() => {
            navigation.navigate('ChangeNumber');
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconView}>
              <FontAwesome name={'phone'} size={22} color={Font.white} />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={Commonstyles.TextWhiteCalender}>Phone no</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => {
              navigation.navigate('ChangeNumber');
            }}>
            <AntDesign name={'right'} size={20} color={Font.white} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Security details */}

      <View style={styles.headingStyle}>
        <Text style={Commonstyles?.TextWhite18600}>Security Details</Text>
      </View>
      <View>
        {/* Password */}
        <TouchableOpacity
          style={styles.details}
          onPress={() => {
            navigation.navigate('ChangePassword');
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconView}>
              <MaterialCommunityIcons
                name={'form-textbox-password'}
                size={22}
                color={Font.white}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={Commonstyles.TextWhiteCalender}>
                Change Password
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => {
              navigation.navigate('ChangePassword');
            }}>
            <AntDesign name={'right'} size={20} color={Font.white} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* App settings */}

      <View style={styles.headingStyle}>
        <Text style={Commonstyles?.TextWhite18600}>App Settings</Text>
      </View>
      <View>
        {/* App Notification */}
        <View style={styles.details}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconView}>
              <MaterialCommunityIcons
                name={'bell'}
                size={22}
                color={Font.white}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={Commonstyles.TextWhiteCalender}>
                App Notification
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{justifyContent: 'center'}}>
            <Switch
              trackColor={{false: '#767577', true: '#212121'}}
              thumbColor={appNotification ? Font.green : '#f4f3f4'}
              ios_backgroundColor="#212121"
              onValueChange={toggleSwitch}
              value={appNotification}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  headingStyle: {
    paddingLeft: 15,
    paddingBottom: 5,
    marginTop: 15,
    borderBottomWidth: 0.5,
    borderColor: Font.greyText,
  },
  details: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 10,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  iconView: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: Font.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});
