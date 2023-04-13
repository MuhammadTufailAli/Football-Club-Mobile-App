import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TrainingReport = ({navigation}) => {
  //Today date and current Month
  let date = new Date();
  let month = date.toLocaleDateString('en-US', {month: 'long'});
  month = month.substring(0, 3);
  var todayDate = moment(date).utc().format('YYYY-MM-DD');
  date = date.toDateString();
  console.log(date);
  const {userdetails, setuserdetails} = useContext(CartProvider);
  const [cond, setCondition] = useState(true);
  const [todayAvg, setTodayAvg] = useState();
  const [highestScore, setHighestScore] = useState();
  const [YourTodayReport, setYourTodayReport] = useState([]);
  const [MentalCond, setMentalCond] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [Index, setIndex] = useState();

  const [todayReport, setTodayReport] = useState('false');
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
  const [AttendanceArray, setAttendanceArray] = useState([
    {
      Date: 20,
      day: 'Tuesday',
      MonthYear: 'Jan,2022',
      status: 4.6,
    },
    {
      Date: 21,
      day: 'Wednesday',
      MonthYear: 'Jan,2022',
      status: 4.1,
    },
    {
      Date: 22,
      day: 'Thursday',
      MonthYear: 'Jan,2022',
      status: 4.3,
    },
    {
      Date: 23,
      day: 'Friday',
      MonthYear: 'Jan,2022',
      status: 4.7,
    },
    {
      Date: 24,
      day: 'Saturday',
      MonthYear: 'Jan,2022',
      status: 4.9,
    },
    {
      Date: 25,
      day: 'Sunday',
      MonthYear: 'Jan,2022',
      status: 4.3,
    },
    {
      Date: 26,
      day: 'Monday',
      MonthYear: 'Jan,2022',
      status: 4.6,
    },
  ]);

  const getTodayEvaluation = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/evaluation/ViewEvaluationsByDateOfPlayer/${userdetails?._id}&${date}`,
      );

      if (result.data.data.length != 0) {
        setYourTodayReport(result.data.data);
        var totalresult = result.data.result;
        var count = 0;
        result.data.data.map(data => {
          count = count + data.avgScore;
        });
        var avg = count / totalresult;
        avg = avg.toFixed(1);
        setTodayAvg(avg);
        console.log(avg);
      }

      try {
        const result = await axios.get(
          `${port.herokuPort}/dailyrecords/GetDailyRecordsOfPlayer/${userdetails?._id}`,
        );
        //setting today Attendence
        const AllAttendece = result.data.data.map(data => {
          //to get day name of attendence
          let date = new Date(data?.date);
          let day = date.toLocaleDateString('en-US', {weekday: 'long'});
          let month = date.toLocaleDateString('en-US', {month: 'long'});
          month = month.substring(0, 3);

          return {avgScore: data.avgScore, date: day, month: month};
        });
        //2nd array to get current month evaluation
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
        try {
          const result = await axios.get(
            `${port.herokuPort}/dailyrecords/GetHighestScoreOfPlayer/${userdetails?._id}`,
          );

          setHighestScore(result.data.data[0].avgScore);

          setCondition(false);
        } catch (err) {
          console.log(err);
          alert('Error');
        }
      } catch (err) {
        console.log(err);
        alert('Error');
      }
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  };
  //Getting to today evaluation
  useEffect(() => {
    getTodayEvaluation();
  }, []);
  if (cond) {
    return (
      <View>
        <Loader />
      </View>
    );
  } else {
    return (
      <View>
        {todayReport === true ? (
          <View>
            <View
              style={{
                margin: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                zIndex: 100,
              }}>
              <Text style={Commonstyles.TextWhiteFeatured}>Today's Report</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome
                  name={'calendar'}
                  size={20}
                  color={Font.green}
                  style={{marginRight: 8, marginLeft: 15}}
                />
                <Text style={Commonstyles?.TextWhiteFeed}>{todayDate}</Text>
              </View>
            </View>

            <FlatList
              contentContainerStyle={{paddingBottom: 10}}
              showsVerticalScrollIndicator={false}
              data={YourTodayReport}
              renderItem={({item, index}) => {
                return (
                  <View style={{marginBottom: 15}}>
                    <TouchableOpacity
                      onPress={() => {
                        setIndex(index);
                        setIsOpen(!isopen);
                      }}
                      style={{
                        marginLeft: 15,
                        marginRight: 15,
                        borderRadius: 5,
                        height: 55,
                        backgroundColor:
                          MentalCond === true ? Font.green : Font.white,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Lexend-Regular',
                          fontSize: 16,
                          fontWeight: '500',
                          color: MentalCond === true ? Font.white : Font.black,
                          marginLeft: 10,
                        }}>
                        {item?.refOfSkill?.skillname}
                      </Text>
                      <AntDesign
                        name={MentalCond === true ? 'caretup' : 'caretdown'}
                        size={16}
                        color={MentalCond === true ? Font.white : Font.black}
                        style={{marginRight: 10}}
                      />
                    </TouchableOpacity>
                    {Index === index && isopen === true
                      ? item?.scores?.map(data => {
                          return (
                            <View
                              style={{
                                marginLeft: 15,
                                marginRight: 15,
                                marginTop: 10,
                                borderRadius: 5,
                                height: 55,
                                backgroundColor: Font.darkGrey,

                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Lexend-Regular',
                                  fontSize: 16,
                                  fontWeight: '500',
                                  color: Font.white,
                                  marginLeft: 10,
                                }}>
                                {data?.refOfSubSkill?.subskillname}
                              </Text>
                              <View style={{marginRight: 10}}>
                                <Text style={Commonstyles.TextGreen24}>
                                  {data?.score}
                                </Text>
                              </View>
                            </View>
                          );
                        })
                      : null}
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View>
            {/* Avg and Highest Score */}
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
                  {YourTodayReport.length === 0 ? (
                    <Text style={Commonstyles.TextGreen24}>NaN</Text>
                  ) : (
                    <Text style={Commonstyles.TextGreen24}>{todayAvg}</Text>
                  )}

                  <Text style={Commonstyles.TextgreyFeed15}>Avg Score</Text>
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
                  <Text style={Commonstyles.TextGreen24}>{highestScore}</Text>

                  <Text style={Commonstyles.TextgreyFeed15}>Highest Score</Text>
                </View>
              </View>
            </View>

            {/* Today report */}
            {YourTodayReport.length === 0 ? (
              <TouchableOpacity
                disabled={true}
                style={{
                  margin: 15,
                  marginTop: 0,
                  height: 52,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Font.grey,
                  borderRadius: 10,
                }}>
                <Text style={Commonstyles.TextWhiteFeed}>
                  Your today's Training Report is not marked yet!
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setTodayReport(true);
                }}
                style={{
                  margin: 15,
                  marginTop: 0,
                  height: 52,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Font.grey,
                  borderRadius: 10,
                }}>
                <Text style={Commonstyles.TextWhiteFeed}>
                  Your today's Training Report is here!
                </Text>
              </TouchableOpacity>
            )}

            {/* Monthly Report */}
            <View>
              <View
                style={{
                  margin: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  zIndex: 100,
                }}>
                <Text style={Commonstyles.TextWhiteFeatured}>Reports</Text>
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
                        setAttendanceToShow(currentMonthAttendence.slice(0, 6));
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

                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',

                                alignSelf: 'center',
                              }}>
                              <Text style={Commonstyles.TextGreen24}>
                                {item?.avgScore}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                  />
                  <TouchableOpacity
                    style={{marginTop: 15, alignItems: 'center'}}
                    onPress={() => {
                      navigation.navigate('TrainingReportList', {
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

                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',

                                alignSelf: 'center',
                              }}>
                              <Text style={Commonstyles.TextGreen24}>
                                {item?.avgScore}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
              )}

              {/* Statistics */}
              <View>
                <View style={{margin: 15}}>
                  {/* <Text style={Commonstyles.TextWhiteFeatured}>Statistics</Text> */}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
};

export default TrainingReport;

const styles = StyleSheet.create({});
