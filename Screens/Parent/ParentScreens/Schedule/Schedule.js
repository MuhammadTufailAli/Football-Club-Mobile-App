import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import moment from 'moment';
//importing calender
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import axios from 'axios';
import CartProvider from '../../../ContextApi/contextApi';
import port from '../../../Port/Port';

//importing Flat list
import FlatListForSchedule from '../../../Components/FlatListForSchedule';

import Loader from '../../../Loader/Loader';

//import font and design
import {Font, Commonstyles} from '../../../Font/Font';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
const Schedule = ({navigation}) => {
  const [Schedule, SetSchedule] = useState('Upcoming');

  const [cond, setCondition] = useState(true);
  const [UpcomingFromBackend, setUpcomingFromBackend] = useState([]);
  const [historyFromBackend, setHistoryFromBackend] = useState([]);
  const [markedDay, setMarkedDay] = useState({});

  //Getting schedule from backend
  const getSchedule = async () => {
    try {
      const result = await axios.get(`${port.herokuPort}/event/GetEvents`);

      //Marked Days on calender

      result.data.data.doc.map(item => {
        if (item.offDay) {
          setMarkedDay(existingValues => ({
            ...existingValues,
            [moment(item?.date).utc().format('YYYY-MM-DD')]: {
              selected: true,
              selectedColor: 'red',
            },
          }));
        } else {
          setMarkedDay(existingValues => ({
            ...existingValues,
            [moment(item?.date).utc().format('YYYY-MM-DD')]: {
              selected: true,
              selectedColor: Font.green,
            },
          }));
        }
      });
      console.log(markedDay);

      setUpcomingFromBackend(
        result.data.data.doc.filter(val => {
          var today = new Date();
          mydate = new Date(val?.date);

          if (mydate >= today) {
            console.log('Upcoming', mydate);
            return val;
          }
        }),
      );
      setHistoryFromBackend(
        result.data.data.doc.filter(val => {
          var today = new Date();
          mydate = new Date(val?.date);

          if (mydate < today) {
            return val;
          }
        }),
      );

      setCondition(false);
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  };

  //Getting schedule from backend
  useEffect(() => {
    getSchedule();
  }, [Schedule]);

  //Getting today date in yyy-mmm-ddd format
  let yourDate = new Date();
  yourDate.toISOString().split('T')[0];
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
  yourDate = yourDate.toISOString().split('T')[0];

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
              size={34}
              color={Font.green}
            />
          </TouchableOpacity>
          <Text style={Commonstyles.LogoWhite}>Schedule</Text>
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
      {/* Selecting schedule */}
      <View
        style={{
          margin: 20,
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: Font.grey,
          height: 52,
          width: '90%',
          alignItems: 'center',
          borderRadius: 26,
        }}>
        <TouchableOpacity
          onPress={() => {
            setCondition(true);
            SetSchedule('Upcoming');
          }}
          style={{
            backgroundColor: Schedule === 'Upcoming' ? Font.green : null,
            borderRadius: 25,
            height: 39,
            width: '34%',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5,
          }}>
          <Text style={Commonstyles.TextWhiteFeed}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCondition(true);
            SetSchedule('Calendar');
          }}
          style={{
            backgroundColor: Schedule === 'Calendar' ? Font.green : null,
            borderRadius: 25,
            height: 39,
            width: '32%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={Commonstyles.TextWhiteFeed}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCondition(true);
            SetSchedule('History');
          }}
          style={{
            backgroundColor: Schedule === 'History' ? Font.green : null,
            borderRadius: 25,
            height: 39,
            width: '34%',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
          }}>
          <Text style={Commonstyles.TextWhiteFeed}>History</Text>
        </TouchableOpacity>
      </View>

      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View style={{margin: 15}}>
          {Schedule === 'Upcoming' ? (
            <View>
              <FlatListForSchedule dataArray={UpcomingFromBackend} />
            </View>
          ) : Schedule === 'Calendar' ? (
            <View>
              {Object.keys(markedDay).length === 0 ? (
                <View>
                  <Text>Wait</Text>
                </View>
              ) : (
                <Calendar
                  markedDates={markedDay}
                  enableSwipeMonths={true}
                  hideExtraDays={true}
                  initialDate={yourDate}
                  style={{
                    backgroundColor: Font.grey,
                    color: 'white',
                  }}
                  theme={{
                    calendarBackground: Font.grey,

                    textSectionTitleColor: Font.white,
                    // textSectionTitleDisabledColor: '#d9e1e8',

                    selectedDayTextColor: '#ffffff',

                    dayTextColor: Font.white,

                    arrowColor: Font.white,

                    monthTextColor: Font.white,

                    textDayFontFamily: Font.fontfamily,
                    textMonthFontFamily: Font.fontfamily,
                    textDayHeaderFontFamily: Font.fontfamily,
                    textDayFontWeight: '400',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 15,
                    textMonthFontSize: 20,
                    textDayHeaderFontSize: 12,
                  }}
                />
              )}

              {/* Telling about calender */}
              <View style={{margin: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 90 / 2,
                      backgroundColor: 'red',
                      marginRight: 10,
                    }}></View>
                  <Text style={Commonstyles.TextWhiteCalender}>
                    No Schedule/ Off Day
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 90 / 2,
                      backgroundColor: Font.green,
                      marginRight: 10,
                    }}></View>
                  <Text style={Commonstyles.TextWhiteCalender}>
                    Something Scheduled
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 90 / 2,
                      backgroundColor: '#00adf5',
                      marginRight: 10,
                    }}></View>
                  <Text style={Commonstyles.TextWhiteCalender}>Today date</Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <FlatListForSchedule dataArray={historyFromBackend} />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Schedule;

const styles = StyleSheet.create({});
