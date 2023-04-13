import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';

//Importing FlatList
import FlatListForFeed from '../../../Components/FlatListForFeed';
import port from '../../../Port/Port';
import CartProvider from '../../../ContextApi/contextApi';

//import Loader
import Loader from '../../../Loader/Loader';

const HomeScreen = ({navigation}) => {
  const Nav = navigation;
  const isFocused = useIsFocused();
  const {userdetails, setuserdetails} = useContext(CartProvider);

  const [cond, setCondition] = useState(true);
  const [feedArrayFromBackend, setFeedArrayFromBackend] = useState([]);
  const [getDataCondition, setDataCondition] = useState(false);

  //getting newsfeed from backend
  const getNewsFeed = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/newsfeed/GetAllNewsFeed`,
      );

      setFeedArrayFromBackend(result.data.data);

      setCondition(false);
    } catch (err) {
      console.log(err.response.data);
      alert('Error');
    }
  };

  useEffect(() => {
    isFocused && getNewsFeed();
  }, [isFocused, getDataCondition]);

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
          <Text style={Commonstyles.LogoWhite}>
            News Feed{'\n'}
            <Text style={Commonstyles.TextGrey}>
              See what's new from the coaches!
            </Text>
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
      {/* FlatList to show the Feeds */}
      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <FlatListForFeed
          FeedArray={feedArrayFromBackend}
          setDataCondition={setDataCondition}
          getDataCondition={getDataCondition}
          navigation={Nav}
          role="Parent"
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
