import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = ({
  size = 'large',
  color = 'black',
}: ActivityIndicatorProps) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})