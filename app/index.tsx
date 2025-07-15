import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './(auth)/login';

const index = () => {
  return (
    <Login />
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});