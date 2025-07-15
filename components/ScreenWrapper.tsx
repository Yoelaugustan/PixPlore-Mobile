import { Dimensions, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScreenWrapperProps } from '@/types'

const {height} = Dimensions.get('window')

const ScreenWrapper = ({style, children, isModal}: ScreenWrapperProps) => {
  let paddingTop = Platform.OS == 'ios'? height * 0.06 : 40;
  let paddingBottom = 0 

  if(isModal){
    paddingTop = Platform.OS == 'ios'? height * 0.02 : 45;
    paddingBottom = height * 0.02 
  }
  return (
    <View 
        style={[
            {
              paddingTop,
              paddingBottom,
              flex: 1,
            },
            style
    ]}>
        <StatusBar barStyle='light-content' />
        {children}
    </View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})