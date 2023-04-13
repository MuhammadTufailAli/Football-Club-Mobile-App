import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';

const Loader = () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Lottie
        style={{margin: 20, width: '80%', height: '80%', alignSelf: 'center'}}
        source={require('../../assets/football.json')}
        autoPlay
        loop
      />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
