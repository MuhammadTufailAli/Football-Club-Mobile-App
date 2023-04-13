import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import moment from 'moment';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import CartProvider from '../../ContextApi/contextApi';
import port from '../../Port/Port';
//import font and design
import {Font, Commonstyles} from '../../Font/Font';

import Loader from '../../Loader/Loader';

//Importing DropDown
import DropDownPicker from 'react-native-dropdown-picker';

//importing icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

//Importing Training Screen
import TrainingReport from './TrainingReport';
import {ScrollView} from 'react-native-gesture-handler';

const Reports = ({navigation}) => {
  //get current date
  let date = new Date();
  let month = date.toLocaleDateString('en-US', {month: 'long'});
  month = month.substring(0, 3);
  date = moment(date).utc().format('YYYY-MM-DD');

  const Nav = navigation;
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cond, setCondition] = useState(true);

  const [todayAttendence, settodayAttendence] = useState('');

  const [Report, SetReport] = useState('Attendance');
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [selectedMonth, SetSelectedMonth] = useState(month);
  const [AllAttendanceArray, setAllAttendanceArray] = useState([]);
  const [AttendanceToShow, setAttendanceToShow] = useState([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(month);
  const [items, setItems] = useState([
    {label: 'Jan', value: 'Jan'},
    {label: 'Feb', value: 'Feb'},
    {label: 'Mar', value: 'Mar'},
    {label: 'Apr', value: 'Apr'},
    {label: 'May', value: 'May'},
    {label: 'Jun', value: 'Jun'},
    {label: 'July', value: 'Jul'},
    {label: 'Aug', value: 'Aug'},
    {label: 'Sep', value: 'Sep'},
    {label: 'Oct', value: 'Oct'},
    {label: 'Nov', value: 'Nov'},
    {label: 'Dec', value: 'Dec'},
  ]);

  //Getting attendence from backend
  const getAttendence = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/attendance/GetAttendanceOfPlayer/${userdetails?._id}`,
      );
      var present = 0;
      var absent = 0;
      //we make 2 arrays 1 contain all attendence 2nd contain attendence of selected month
      //setting today Attendence
      const AllAttendece = result.data.data.attendance.map(data => {
        const allDate = moment(data.date).utc().format('YYYY-MM-DD');

        if (allDate === date) {
          data.attendance.map(data => {
            if (data?.refOfPlayer === userdetails?._id) {
              settodayAttendence(data?.isPresent);
            }
          });
        }
        //setting absent or present
        var isPresent = data.attendance.map(data => {
          if (data?.refOfPlayer === userdetails?._id) {
            if (data?.isPresent) {
              present = present + 1;
            } else {
              absent = absent + 1;
            }
            return data?.isPresent;
          }
        });

        isPresent = isPresent.filter(function (element) {
          return element !== undefined;
        });
        //to get day name of attendence
        let date = new Date(data?.date);
        let day = date.toLocaleDateString('en-US', {weekday: 'long'});
        let month = date.toLocaleDateString('en-US', {month: 'long'});
        month = month.substring(0, 3);

        return {attendence: isPresent[0], date: day, month: month};
      });

      //because we want to show only 6 attence on main page
      // if (AllAttendece.length > 6) {
      //   setAttendanceToShow(AllAttendece.slice(0, 6));
      // }
      // else{
      //   setAttendanceToShow(AllAttendece);

      // }

      //2nd array to get current month attendence
      var currentMonthAttendence = AllAttendece.map(item => {
        if (item?.month === selectedMonth) {
          return item;
        }
      });
      //removing undefined from array
      currentMonthAttendence = currentMonthAttendence.filter(function (
        element,
      ) {
        return element !== undefined;
      });

      if (currentMonthAttendence.length > 7) {
        setAttendanceToShow(currentMonthAttendence.slice(0, 6));
      } else {
        setAttendanceToShow(currentMonthAttendence);
      }

      setAllAttendanceArray(AllAttendece);

      // return date.toLocaleDateString("en-US", {weekday: 'long'});

      setTotalPresent(present);
      setTotalAbsent(absent);

      setCondition(false);
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  };

  //Getting attendence from backend
  useEffect(() => {
    getAttendence();
  }, [Report]);

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: Font.black}}>
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
          <Text style={Commonstyles.LogoWhite}>Reports</Text>
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

      {/* Selecting schedule */}
      <View
        style={{
          margin: 20,
          marginLeft: 15,
          marginRight: 15,

          backgroundColor: Font.grey,
          height: 52,

          borderRadius: 26,
        }}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              SetReport('Attendance');
            }}
            style={{
              flex: 1,
              backgroundColor: Report === 'Attendance' ? Font.green : null,
              borderRadius: 25,
              height: 39,
              width: '34%',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
            }}>
            <Text style={Commonstyles.TextWhiteFeed}>Attendance Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SetReport('Training');
            }}
            style={{
              flex: 1,
              backgroundColor: Report === 'Training' ? Font.green : null,
              borderRadius: 25,
              height: 39,
              width: '32%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={Commonstyles.TextWhiteFeed}>Training Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cond ? (
        <View>
          <Loader />
        </View>
      ) : (
        <View>
          {Report === 'Attendance' ? (
            <View>
              {/* Present and absent */}
              <View
                style={{
                  margin: 15,
                  marginTop: 0,

                  height: 100,
                }}>
                <View
                  style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <View
                    style={{
                      flex: 1,
                      height: 93,
                      backgroundColor: Font.grey,
                      marginRight: 5,
                      borderRadius: 11,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={Commonstyles.TextGreen24}>{totalPresent}</Text>

                    <Text style={Commonstyles.TextgreyFeed15}>
                      Total Presents
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      height: 93,
                      backgroundColor: Font.grey,
                      marginLeft: 5,
                      borderRadius: 11,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={Commonstyles.TextRed24}>{totalAbsent}</Text>

                    <Text style={Commonstyles.TextgreyFeed15}>
                      Total Absents
                    </Text>
                  </View>
                </View>
              </View>

              {/* Today presence */}
              <View
                style={{
                  margin: 15,
                  marginTop: 0,
                  height: 52,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Font.grey,
                  borderRadius: 10,
                }}>
                {todayAttendence.length === 0 ? (
                  <Text style={Commonstyles.TextWhiteFeed}>
                    Your attendence is not marked yet!!!
                  </Text>
                ) : todayAttendence ? (
                  <Text style={Commonstyles.TextWhiteFeed}>
                    You were present at training today!
                  </Text>
                ) : (
                  <Text style={Commonstyles.TextWhiteFeed}>
                    You were absent at training today!
                  </Text>
                )}
              </View>

              {/* Monthly Attendence */}
              <View>
                <View
                  style={{
                    margin: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    zIndex: 100,
                  }}>
                  <Text style={Commonstyles.TextWhiteFeatured}>
                    Monthly Attendance
                  </Text>
                  <View>
                    <DropDownPicker
                      style={{
                        backgroundColor: Font.blue2,
                      }}
                      placeholderStyle={Commonstyles?.TextWhite12300}
                      labelStyle={Commonstyles?.TextWhite12300}
                      textStyle={Commonstyles?.TextWhite12300}
                      dropDownContainerStyle={{
                        backgroundColor: Font.blue2,
                      }}
                      dropDownDirection="BOTTOM"
                      maxHeight={480}
                      containerProps={{
                        style: {
                          height: open
                            ? AttendanceToShow.length < 4
                              ? 40 * (items.length + 1)
                              : 0 * (items.length + 1)
                            : 10,
                          width: 81,
                          borderRadius: 5,
                        },
                      }}
                      placeholder={selectedMonth}
                      // disableBorderRadius={true}
                      autoScroll={true}
                      showArrowIcon={true}
                      showTickIcon={true}
                      open={open}
                      value={value}
                      items={items}
                      setOpen={setOpen}
                      setValue={setValue}
                      setItems={setItems}
                      onChangeValue={value => {
                        var currentMonthAttendence = AllAttendanceArray.map(
                          item => {
                            if (item?.month === value) {
                              return item;
                            }
                          },
                        );
                        currentMonthAttendence = currentMonthAttendence.filter(
                          function (element) {
                            return element !== undefined;
                          },
                          AttendanceToShow,
                        );

                        if (currentMonthAttendence.length > 7) {
                          setAttendanceToShow(
                            currentMonthAttendence.slice(0, 6),
                          );
                        } else {
                          setAttendanceToShow(currentMonthAttendence);
                        }
                      }}
                    />
                  </View>
                </View>
                {AttendanceToShow.length > 5 ? (
                  <View style={{margin: 15}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={AttendanceToShow}
                      renderItem={({item, index}) => {
                        //Getting day,month,year and datename
                        let [first, ...rest] = item?.date.split(',');
                        var year = item?.date.substr(item?.date.length - 4);
                        var day = item?.date.substr(item?.date.length - 7, 2);
                        if (day.charAt(0) === '/') {
                          day = 0 + day.charAt(1);
                        }

                        return (
                          <View
                            style={{
                              height: 53,

                              marginTop: 10,
                              backgroundColor: Font.grey,
                              borderRadius: 10,
                              borderLeftWidth: 3,
                              borderColor: Font.blue2,
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                marginRight: 10,
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text style={Commonstyles.TextWhite24}>
                                  {day}
                                </Text>
                                <View style={{marginLeft: 15}}>
                                  <Text style={Commonstyles.TextGreysmall300}>
                                    {first}
                                    {'\n'}
                                    {item?.month}, {year}
                                  </Text>
                                </View>
                              </View>
                              {item.attendence ? (
                                <View
                                  style={{
                                    width: 84,
                                    height: 22,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: Font.green,
                                    alignSelf: 'center',
                                  }}>
                                  <Text style={Commonstyles.TextWhitesmall300}>
                                    Present
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    width: 84,
                                    height: 22,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: Font.red,
                                    alignSelf: 'center',
                                  }}>
                                  <Text style={Commonstyles.TextWhitesmall300}>
                                    Absent
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    />

                    <TouchableOpacity
                      style={{marginTop: 15, alignItems: 'center'}}
                      onPress={() => {
                        navigation.navigate('MonthlyAttendance', {
                          attendence: AllAttendanceArray,
                          month: value,
                        });
                      }}>
                      <Text style={Commonstyles.TextWhitesmall}>View More</Text>
                      <AntDesign name={'down'} size={16} color={Font.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{margin: 15}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={AttendanceToShow}
                      renderItem={({item, index}) => {
                        let [first, ...rest] = item?.date.split(',');
                        var year = item?.date.substr(item?.date.length - 4);
                        var day = item?.date.substr(item?.date.length - 7, 2);
                        if (day.charAt(0) === '/') {
                          day = 0 + day.charAt(1);
                        }
                        return (
                          <View
                            style={{
                              height: 53,

                              marginTop: 10,
                              backgroundColor: Font.grey,
                              borderRadius: 10,
                              borderLeftWidth: 3,
                              borderColor: Font.blue2,
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                marginRight: 10,
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text style={Commonstyles.TextWhite24}>
                                  {day}
                                </Text>
                                <View style={{marginLeft: 15}}>
                                  <Text style={Commonstyles.TextGreysmall300}>
                                    {first}
                                    {'\n'}
                                    {item?.month}, {year}
                                  </Text>
                                </View>
                              </View>
                              {item.attendence ? (
                                <View
                                  style={{
                                    width: 84,
                                    height: 22,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: Font.green,
                                    alignSelf: 'center',
                                  }}>
                                  <Text style={Commonstyles.TextWhitesmall300}>
                                    Present
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    width: 84,
                                    height: 22,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: Font.red,
                                    alignSelf: 'center',
                                  }}>
                                  <Text style={Commonstyles.TextWhitesmall300}>
                                    Absent
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    />
                  </View>
                )}
              </View>

              {/* Statistics */}
              <View>
                <View style={{margin: 15}}>
                  {/* <Text style={Commonstyles.TextWhiteFeatured}>Statistics</Text> */}
                </View>
              </View>
            </View>
          ) : (
            <View>
              <TrainingReport navigation={Nav} />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default Reports;

const styles = StyleSheet.create({});
