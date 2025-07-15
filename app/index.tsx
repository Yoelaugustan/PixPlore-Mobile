import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './(auth)/login';
import ScreenWrapper from '@/components/ScreenWrapper';

const index = () => {
  return (
    <ScreenWrapper>
      <Text>Home Page</Text>
    </ScreenWrapper>
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