import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../../ContextApi/contextApi';
import port from '../../Port/Port';

//import font and design
import {Font, Commonstyles} from '../../Font/Font';

import Loader from '../../Loader/Loader';
//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';

//importing FLatList for group
import FlatListForGroups from '../../Components/FlatListForGroups';

const Groups = ({navigation}) => {
  var Nav = navigation;
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cond, setCondition] = useState(true);
  const [groupArrayFromBackend, setGroupArrayFromBackend] = useState([]);

  //Get groups in which player is member
  const getGroups = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/group/GetAllPlayerGroups/${userdetails?._id}`,
      );

      setGroupArrayFromBackend(result.data.data);

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  //Get groups in which player is member
  useEffect(() => {
    getGroups();
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
          <Text style={Commonstyles.LogoWhite}>
            My Groups{'\n'}
            <Text style={Commonstyles.TextGrey}>Groups are listed below</Text>
          </Text>
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
      {/* FlatList for Groups */}
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <FlatListForGroups
          GroupArray={groupArrayFromBackend}
          navigation={Nav}
        />
      )}
    </SafeAreaView>
  );
};

export default Groups;

const styles = StyleSheet.create({});
