import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                backgroundColor: '#0f0D23',
                borderRadius: 50,
                marginHorizontal: 20,
                marginBottom: 36,
                height: 42,
                position: 'absolute',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#0f0D23',
                }
            }}
        >
            <Tabs.Screen 
                name='index'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                        name={focused ? 'home' : 'home-outline'}
                        size={size}
                        color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen 
                name='cameraPage'
                options={{
                    title: 'Pix it!',
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                        name={focused ? 'camera' : 'camera-outline'}
                        size={size}
                        color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen 
                name='flashCardPage'
                options={{
                    title: 'Flash Cards',
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                        name={focused ? 'book' : 'book-outline'}
                        size={size}
                        color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen 
                name='userPage'
                options={{
                    title: 'User',
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                        name={focused ? 'person' : 'person-outline'}
                        size={size}
                        color={color}
                        />
                    ),
                }}
            />
        </Tabs>

        
    )
}

export default _layout

const styles = StyleSheet.create({})