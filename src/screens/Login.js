'use strict'
import { View, Text, SafeAreaView, StyleSheet, Alert, Pressable } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Fontisto, SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux';

import { validEmailRegex } from '../constants'
import { loginApp, fetchCart, fetchUserFavourites, fetchProductsFromServer } from '../services';
import useValidate from '../hooks/useValidate';
import GlobalStyles from '../untils/GlobalStyles';
import FormContainer from '../components/FormContainer';
import FormHeader from '../components/FormHeader';
import FormInputField from '../components/FormInputField';
import CustomButton from '../components/CustomButton';
import NavigateQuestion from '../components/NavigateQuestion';
import Apploading from '../components/AppLoading'
import SocialsLogin from '../components/SocialsLogin';
import { setCurrentUserAction, setCartAction, addToFavoritesAction, setProductsAction } from '../redux/actions'

function Login({ navigation }) {
    // states
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showLoading, setShowLoading] = useState(false)
    const { invalidFields, handleSetInvalidFields, handleResetInvalidFields, handleCheckInvalid } = useValidate()
    const dispatch = useDispatch()

    // if user already logined then check userToken and navigate straight to BottomTabs
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const result = await AsyncStorage.getItem('userToken')
                const userToken = JSON.parse(result)
                // if user logined then navigate to main bottom tab
                if(userToken) {
                    dispatch(setCurrentUserAction(userToken))
                    fetchProductsFromServer()
                        .then(res => dispatch(setProductsAction(res.data.products)))
                        .catch(err => console.error(err))
                    fetchCart(userToken)
                        .then(res => dispatch(setCartAction(res.data.products)))
                        .catch(err => console.error(err))
                    fetchUserFavourites(userToken)
                        .then(res => dispatch(addToFavoritesAction(res.data.products)))
                        .catch(err => console.error(err))
                }
            }
            catch(error)
            {
                console.log('error message', error)
            }
        }
        checkLoginStatus()
        console.log('Check user status')
    }, [])

    // handler functions
    const handleEmailChange = (value) => setEmailInput(value);
    const handlePasswordChange = (value) => setPasswordInput(value);

    const validateFormInput = useCallback(() => {
        let check = true
        if(!emailInput.trim()) {
            handleSetInvalidFields('email', 'Please enter your email')
            check = false
        }
        if(!passwordInput.trim()) {
            handleSetInvalidFields('password', 'Please enter your password')
            check = false
        }
        if(!emailInput.trim().match(validEmailRegex)) {
            handleSetInvalidFields('email', 'Your email is invalid')
            check = false
        }
        return check
    }, [emailInput,passwordInput, handleSetInvalidFields])

    const handleLogin = useCallback(() => {
        if(validateFormInput()) {
            setShowLoading(true)
            const user = {
                email : emailInput,
                password : passwordInput,
            }

            setTimeout(() => {
                setShowLoading(false)
                loginApp(user)
                    .then(response => {
                        // save token to asyncStorage so user don't need to login the next time
                        AsyncStorage.setItem('userToken', JSON.stringify(response.data.token))
                        
                        // navigate to MainBottom tabs by set authState in redux store
                        dispatch(setCurrentUserAction(response.data.token))
                        fetchProductsFromServer()
                                .then(res => dispatch(setProductsAction(res.data.products)))
                                .catch(err => console.error(err))
                        fetchCart(response.data.token)
                            .then(res => dispatch(setCartAction(res.data.products)))
                            .catch(err => console.log(err))
                        fetchUserFavourites(response.data.token)
                            .then(res => dispatch(addToFavoritesAction(res.data.products)))
                            .catch(err => console.error(err))
                    })
                    .catch(error => {        
                        console.log(error)                
                        Alert.alert('Login error', error.response.status === 400 ? 'Your password is incorrect' : 'Your email is not exist')
                    })
            }, 1200)
        }
    }, [validateFormInput, emailInput, passwordInput, setShowLoading, dispatch])

    // return JSX
    return (
        <SafeAreaView style={[GlobalStyles.container, { justifyContent: 'center' }]}>
            <FormContainer>
                <FormHeader
                    image={require('../../assets/images/logo.png')}
                    title="Login Your Account"
                />

                <View style={styles.formGroup}>
                    <FormInputField
                        value={emailInput}
                        placeholder="Enter your email"
                        type="email"
                        isInvalid={handleCheckInvalid('email')}
                        icon={<Fontisto name="email" size={26} color="black" />}
                        handleTextChange={handleEmailChange}
                        handleOnFocus={() => handleResetInvalidFields('email')}
                    />
                    {handleCheckInvalid('email') && <Text style={GlobalStyles.invalidMessage}>{invalidFields['email']}</Text>}
                </View>
                <View style={styles.formGroup}>
                    <FormInputField
                        value={passwordInput}
                        placeholder="Enter your password"
                        isSecure
                        isInvalid={handleCheckInvalid('password')}
                        icon={<SimpleLineIcons name="lock" size={26} color="black" />}
                        handleTextChange={handlePasswordChange}
                        handleOnFocus={() => handleResetInvalidFields('password')}
                    />
                    {handleCheckInvalid('password') && <Text style={GlobalStyles.invalidMessage}>{invalidFields['password']}</Text>}
                </View>

                <View
                    style={{
                        marginTop: 14,
                        width: '100%',
                    }}
                >
                    <Pressable
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotPassword}>Forgot Password</Text>
                    </Pressable>                   
                </View>

                <View style={{ marginTop: 20, width: '100%' }}>
                    <CustomButton title="LOGIN" handleOnPress={handleLogin} />
                </View>

                <View style={{ marginTop: 30, width: '100%' }}>
                    <NavigateQuestion
                        question="Don't have an account?"
                        command="Sign up here!"
                        handleNavigate={() => navigation.navigate('SignUp')}
                    />
                </View>

                {/* Login with socials section */}
                <SocialsLogin />
                
            </FormContainer>
            { showLoading && <Apploading /> }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    formGroup: {
        marginTop: 26,
        width: '100%',
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: '500',
        color: GlobalStyles.primaryColor,
    },
});

export default Login;
