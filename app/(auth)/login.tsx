import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Input from '@/components/input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'

const Login = () => {
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const router = useRouter()

    const handleSubmit = async()=>{
        if(!emailRef.current || !passwordRef.current){
            Alert.alert('Login', 'Pleese fill all the fields')
            return
        }

        setIsLoading(true)

        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailRef.current,
                password: passwordRef.current,
            })

            if (error) {
                Alert.alert("Login Error", error.message)
                return
            }

            if (data.user) {
                router.replace("/tabs/index")
            }
            
        } catch(error: any){
            Alert.alert("Login Error", error.message || "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScreenWrapper>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.container}>
                    {/* Back Button */}
                    <BackButton iconSize={28}/>

                    <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} style={{gap: 5}}>
                        <Text style={{ fontSize: verticalScale(30), fontWeight: '800' }}>Welcome Back !</Text>
                        <Text style={{ fontSize: verticalScale(20), fontWeight: '500' }}>Sign in to continue</Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} style={styles.form}>
                        {/* input */}
                        <Input 
                            placeholder='Enter Your Email'
                            onChangeText={value=>emailRef.current = value}
                            icon={<Icons.EnvelopeSimple size={verticalScale(26)} color='black' weight='bold'/>}
                        />
                        <Input 
                            placeholder='Enter Your Password'
                            containerStyle={styles.password}
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

                        <Button loading={isLoading} onPress={handleSubmit}>
                            <Text style={{ fontSize: verticalScale(21), fontWeight: '700', color: 'white' }}>Login</Text>
                        </Button>
                    </Animated.View>
                    
                    {/* Footer */}
                    <Animated.View entering={FadeInDown.duration(1000).delay(300).springify().damping(12)} style={styles.footer}>
                        <Text style={{ fontSize: verticalScale(15) }}>Don't have an account?</Text>
                        <Pressable onPress={()=>router.navigate('/(auth)/register')}>
                            <Text style={{ fontSize: verticalScale(15), fontWeight: '700', color: 'white' }}>Sign Up</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default Login

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
    loginImage: {
        width: "100%",
        height: verticalScale(250),
        justifyContent: 'center'
    },
    password: {
        justifyContent: 'flex-start'
    }
})