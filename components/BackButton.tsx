import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling'
import { radius } from '@/constants/theme'

const BackButton = ({
    style,
    iconSize = 26,
}: BackButtonProps) => {
    const router = useRouter()
  return (
    <TouchableOpacity onPress={()=>router.back()} style={[styles.button, style]}>
        <ArrowLeft
            size={verticalScale(iconSize)}
            color='black'
            weight='bold'
        />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        borderRadius: radius._12,
        borderCurve: 'continuous',
        padding: 5,
    },
})