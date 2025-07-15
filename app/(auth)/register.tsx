import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import ScreenWrapper from '@/components/ScreenWrapper'
import Animated, { FadeInDown } from 'react-native-reanimated'
import BackButton from '@/components/BackButton'
import Input from '@/components/input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'

const Register = () => {
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const passwordConfirmRef = useRef('')
    const nameRef = useRef('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showConfPass, setShowConfPass] = useState(false)
    const router = useRouter()

    const handleSubmit = async()=>{
        let name = nameRef.current.trim()
        let email = emailRef.current.trim()
        let password = passwordRef.current.trim()
        let passwordConfirm = passwordConfirmRef.current.trim()

        if (!name || !email || !password || !passwordConfirm) {
            Alert.alert('Sign Up', 'Please fill in all fields.');
            return;
        }

        if (password !== passwordConfirm) {
            Alert.alert('Sign Up', 'Passwords do not match.');
            return;
        }

        setIsLoading(true)
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name
                }
            }
        })
        setIsLoading(false)
        if (error) Alert.alert(error.message)
        else Alert.alert("Account Created")
        
    }
    
    return (
        <ScreenWrapper>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.container}>
                    {/* Back Button */}
                    <BackButton iconSize={28}/>
            
                    <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} style={{gap: 5}}>
                        <Text style={{ fontSize: verticalScale(30), fontWeight: '800' }}>Let's Get Started</Text>
                        <Text style={{ fontSize: verticalScale(15), fontWeight: '400' }}>Create your account to start exploring</Text>
                    </Animated.View>

                    {/* form */}
                    <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} style={styles.form}>
                        {/* input */}
                        <Input 
                            placeholder='Enter Your Name'
                            onChangeText={value=>nameRef.current = value}
                            icon={<Icons.User size={verticalScale(26)} color='black' weight='bold'/>}
                        />
                        <Input 
                            placeholder='Enter Your Email'
                            onChangeText={value=>emailRef.current = value}
                            icon={<Icons.EnvelopeSimple size={verticalScale(26)} color='black' weight='bold'/>}
                        />
                        <Input 
                            containerStyle={styles.password}
                            placeholder='Enter Your Password'
                            secureTextEntry={!showPass}
                            onChangeText={value=>passwordRef.current = value}
                            icon={
                                <TouchableOpacity
                                    onPress={()=> setShowPass(value => !value)}
                                >
                                    {showPass
                                        ? <Icons.Eye size={verticalScale(26)} color='black' weight='bold'/>
                                        : <Icons.EyeClosed size={verticalScale(26)} color='black' weight='bold'/>
                                    }
                                </TouchableOpacity>
                            }
                        />
                        <Input
                            containerStyle={styles.password}
                            placeholder='Confirm Your Password'
                            secureTextEntry={!showConfPass}
                            onChangeText={value=>passwordConfirmRef.current = value}
                            icon={
                                <TouchableOpacity
                                    onPress={()=> setShowConfPass(value => !value)}
                                >
                                    {showConfPass
                                        ? <Icons.Eye size={verticalScale(26)} color='black' weight='bold'/>
                                        : <Icons.EyeClosed size={verticalScale(26)} color='black' weight='bold'/>
                                    }
                                </TouchableOpacity>
                            }
                        />

                        <Button loading={isLoading} onPress={handleSubmit}>
                            <Text style={{ fontSize: verticalScale(21), fontWeight: '700', color: 'white' }}>Sign Up</Text>
                        </Button>
                    </Animated.View>
                    
                    {/* Footer */}
                    <Animated.View entering={FadeInDown.duration(1000).delay(300).springify().damping(12)} style={styles.footer}>
                        <Text style={{ fontSize: verticalScale(15) }}>Already have an account?</Text>
                        <Pressable onPress={()=>router.navigate('/(auth)/login')}>
                            <Text style={{ fontSize: verticalScale(15), fontWeight: '700', color: 'white' }}>Log In</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: 'bold',
        color: 'black'
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: "500",
        color: 'black'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        color: 'black',
        fontSize: verticalScale(15),
    },
    password: {
        justifyContent: 'flex-start'
    }
})