import ScreenWrapper from '@/components/ScreenWrapper';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FlashCardPage() {
    return (
        <ScreenWrapper style={styles.container}>
            <View>
                <Text style={styles.title}>FlashCard</Text>
            </View>
            <View>
                
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    title: {
        fontSize: 24,
    },
});