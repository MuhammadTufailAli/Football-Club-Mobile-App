import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

//Importing Context api
import {CartProvider} from './Screens/ContextApi/contextApi';

//Checking if user is logged in or not
import Authentication from './Screens/Authentication/Authentication';

const App = () => {
  return (
    <>
      <CartProvider>
        <Authentication />
      </CartProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create();
