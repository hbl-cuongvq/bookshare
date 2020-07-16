import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native'


import Svg, {
    G,
    Ellipse
} from 'react-native-svg'

import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick"

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { createUserWithEmailAndPassword } from '../api/user/signUp'

import { AuthContext } from '../contexts/Auth'
import Toast from 'react-native-simple-toast';

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

const borderColor = {
    active: 'rgba(244, 67, 54, 1)',
    inActive: 'rgba(0, 0, 0, 0.32)'
}

export default class SignUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            securityPassword: true,
            securityConfirmPassword: true,
            emailBorderColor: borderColor.inActive,
            usernameBorderColor: borderColor.inActive,
            passwordBorderColor: borderColor.inActive,
            confirmPasswordBorderColor: borderColor.inActive,
            error: null
        }

        this.emailRef = React.createRef()
        this.usernameRef = React.createRef()
        this.passwordRef = React.createRef()
        this.confirmPasswordRef = React.createRef()

        this.onChangeText = this.onChangeText.bind(this)
    }

    onChangeText = (text) => {
        if (this.emailRef.current.isFocused()) {
            this.setState({
                email: text
            })
        }

        if (this.usernameRef.current.isFocused()) {
            this.setState({
                username: text
            })
        }

        if (this.passwordRef.current.isFocused()) {
            this.setState({
                password: text
            })
        }

        if (this.confirmPasswordRef.current.isFocused()) {
            this.setState({
                confirmPassword: text
            })
        }
    }

    setEmptyError = () => {
        this.setState({
            error: ''
        })
    }

    changeSecurityPassword = () => {
        this.setState({
            securityPassword: !this.state.securityPassword
        })
    }

    changeSecurityConfirmPassword = () => {
        this.setState({
            securityConfirmPassword: !this.state.securityConfirmPassword
        })
    }

    FocusBorderColor = () => {
        if (this.emailRef.current.isFocused()) {
            this.setState({
                emailBorderColor: borderColor.active
            })
        }

        if (this.usernameRef.current.isFocused()) {
            this.setState({
                usernameBorderColor: borderColor.active
            })
        }

        if (this.passwordRef.current.isFocused()) {
            this.setState({
                passwordBorderColor: borderColor.active
            })
        }

        if (this.confirmPasswordRef.current.isFocused()) {
            this.setState({
                confirmPasswordBorderColor: borderColor.active
            })
        }
    }

    EndEditingBorderColor = () => {
        if (!this.emailRef.current.isFocused()) {
            this.setState({
                emailBorderColor: borderColor.inActive
            })
        }

        if (!this.usernameRef.current.isFocused()) {
            this.setState({
                usernameBorderColor: borderColor.inActive
            })
        }

        if (!this.passwordRef.current.isFocused()) {
            this.setState({
                passwordBorderColor: borderColor.inActive
            })
        }

        if (!this.confirmPasswordRef.current.isFocused()) {
            this.setState({
                confirmPasswordBorderColor: borderColor.inActive
            })
        }
    }

    signUp = async (email, username, password, confirmPassword) => {
        let errorMessage = null

        password !== confirmPassword ? errorMessage = 'Confirm password is not correct. please check again!' : null
        confirmPassword === '' ? errorMessage = 'Confirm password is empty!' : null
        password === '' ? errorMessage = 'Password is empty!' : null
        username === '' ? errorMessage = 'Username is empty!' : null
        email === '' ? errorMessage = 'Email is empty!' : null

        if (errorMessage === null) {
            try {
                // SIGN UP
                await createUserWithEmailAndPassword(email, password, username)
                let value = this.context
                await value.onSignIn(email, password)
            } catch (err) {
                Toast.show(err)
            }
        } else {
            this.setState({ error: errorMessage })
        }

    }

    render() {
        const { password, securityPassword, email, confirmPassword, securityConfirmPassword, error, username } = this.state

        return (
            <View
                style={styles.container}
            >
                <View style={styles.circle}></View>
                <KeyboardAvoidingView
                    behavior='position'
                    style={{
                        padding: 16
                    }}
                >
                    <View style={[StyleSheet.absoluteFill], {
                        position: 'absolute',
                        left: -147,
                        top: -116
                    }}>
                        <Svg width="1088" height="1269" viewBox="0 0 1088 1269">
                            <G transform="translate(147 112)">
                                <Ellipse class="a" cx="119.5" cy="119" rx="119.5" ry="119" transform="translate(-86 277)" fill="#e9e9e9" />
                                <Ellipse class="b" cx="407" cy="266.5" rx="407" ry="266.5" transform="translate(-101 -112)" fill="#fff" />
                                <Ellipse class="a" cx="544" cy="413.5" rx="544" ry="413.5" transform="translate(-147 330)" fill="#e9e9e9" />
                            </G>
                        </Svg>
                    </View>

                    {/* LOGO */}
                    <Image
                        style={{
                            width: 123 / 360 * widthScreen,
                            height: 123 / 360 * widthScreen,
                            marginTop: 25,
                            marginBottom: 26,
                            alignSelf: 'center'
                        }}
                        source={require('../assets/logo.png')}
                    />

                    {/* EMAIL TEXTINPUT */}
                    <View
                        style={[styles.textInputWrapper, { marginBottom: 20 }]}
                    >
                        <MaterialIcons
                            name='email'
                            size={24}
                            style={[{ color: this.state.emailBorderColor }]}
                        />
                        <TextInput
                            ref={this.emailRef}
                            onChangeText={text => { this.onChangeText(text) }}
                            value={email}
                            keyboardType='email-address'
                            style={[styles.textInput, { color: this.state.emailBorderColor }]}
                            placeholder={'email'}
                            placeholderTextColor={borderColor.inActive}
                            onFocus={() => { this.FocusBorderColor(); this.setEmptyError() }}
                            onEndEditing={this.EndEditingBorderColor}
                        />
                    </View>

                    {/* USERNAME TEXTINPUT */}
                    <View
                        style={[styles.textInputWrapper, { marginBottom: 20 }]}
                    >
                        <MaterialIcons
                            name='person'
                            size={24}
                            style={[{ color: this.state.usernameBorderColor }]}
                        />
                        <TextInput
                            ref={this.usernameRef}
                            onChangeText={text => this.onChangeText(text)}
                            value={username}
                            style={[styles.textInput, { color: this.state.usernameBorderColor, borderBottomColor: this.state.usernameBorderColor }]}
                            placeholder='Tên người dùng'
                            placeholderTextColor={borderColor.inActive}
                            onFocus={() => { this.FocusBorderColor(); this.setEmptyError() }}
                            onEndEditing={this.EndEditingBorderColor}
                        />
                    </View>

                    {/* PASSWORD TEXTINPUT */}
                    <View
                        style={[styles.textInputWrapper, { marginBottom: 20 }]}
                    >
                        <MaterialIcons
                            name={securityPassword ? 'lock' : 'lock-open'}
                            size={24}
                            style={[{ color: this.state.usernameBorderColor }]}
                        />
                        <TextInput
                            ref={this.passwordRef}
                            onChangeText={text => this.onChangeText(text)}
                            value={password}
                            style={[styles.textInput, { color: this.state.passwordBorderColor, borderBottomColor: this.state.passwordBorderColor, width: widthScreen - 16 * 2 }]}
                            placeholder='Mật khẩu'
                            placeholderTextColor={borderColor.inActive}
                            onFocus={() => { this.FocusBorderColor(); this.setEmptyError() }}
                            onEndEditing={this.EndEditingBorderColor}
                            secureTextEntry={securityPassword}
                        />
                        <FontAwesome5
                            name={securityPassword ? 'eye' : 'eye-slash'}
                            size={16}
                            style={[{ color: this.state.passwordBorderColor }]}
                            onPress={this.changeSecurityPassword}
                        />
                    </View>

                    {/* CONFIRM PASSWORD TEXTINPUT */}
                    <View
                        style={[styles.textInputWrapper]}
                    >
                        <MaterialIcons
                            name={securityConfirmPassword ? 'lock' : 'lock-open'}
                            size={24}
                            style={[{ color: this.state.usernameBorderColor }]}
                        />
                        <TextInput
                            ref={this.confirmPasswordRef}
                            onChangeText={text => this.onChangeText(text)}
                            value={confirmPassword}
                            style={[styles.textInput, { color: this.state.confirmPasswordBorderColor, borderBottomColor: this.state.confirmPasswordBorderColor, width: widthScreen - 16 * 2 }]}
                            placeholder='Nhập lại mật khẩu'
                            placeholderTextColor={borderColor.inActive}
                            onFocus={() => { this.FocusBorderColor(); this.setEmptyError() }}
                            onEndEditing={this.EndEditingBorderColor}
                            secureTextEntry={securityConfirmPassword}
                        />
                        <FontAwesome5
                            name={securityConfirmPassword ? 'eye' : 'eye-slash'}
                            size={16}
                            style={[{ color: this.state.confirmPasswordBorderColor }]}
                            onPress={this.changeSecurityConfirmPassword}
                        />
                    </View>

                    <Text
                        style={styles.error}
                    >{error}</Text>

                    <View style={{
                        marginBottom: 26
                    }}></View>
                </KeyboardAvoidingView>

                <View
                    style={{
                        paddingHorizontal: 16
                    }}
                >
                    {/* SIGNUP BUTTON */}
                    <AwesomeButtonRick
                        backgroundColor='rgba(244, 67, 54, 1)'
                        backgroundDarker='lightgray'
                        backgroundShadow='transparent'
                        backgroundProgress='rgba(0,0,0,0.32)'
                        stretch={true}
                        progress={true}
                        onPress={async (next) => {
                            await this.signUp(email, username, password, confirmPassword)
                            next()
                        }}
                        springRelease={true}
                    >
                        <Text style={styles.signInButtonText}>ĐĂNG KÝ</Text>
                    </AwesomeButtonRick>

                    {/* SIGNIN LINK */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 24
                    }}>
                        <Text style={{ color: 'rgba(0,0,0,0.54)' }}>Bạn đã có tài khoản? </Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SignIn')}
                        >
                            <Text style={{ color: borderColor.active, fontWeight: 'bold' }}>Hãy đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

SignUp.contextType = AuthContext

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F5F7',
        flex: 1
    },
    circle: {
        backgroundColor: 'white',
        width: 450 / 360 * widthScreen,
        height: 450 / 360 * widthScreen,
        borderRadius: 450 / 2 / 360 * widthScreen,
        position: 'absolute',
        left: -90 / 360 * widthScreen,
        top: -5 / 640 * heightScreen

    },
    signInButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 4,
        backgroundColor: 'rgba(244, 67, 54, 1)',
        borderRadius: 7
    },
    signInButtonText: {
        color: 'white',
        fontSize: 14,
        letterSpacing: 2
    },
    link: {
        alignItems: 'center',
        marginTop: 18
    },
    signUpText: {
        fontSize: 14,
        color: 'rgba(244, 67, 54, 1)'
    },
    error: {
        color: 'red',
        fontSize: 10,
        alignSelf: 'center',
        marginTop: 8
    },
    eyeIcon: {
        right: 0,
        padding: 8,
        paddingBottom: 25,
        marginTop: 4,
        position: 'absolute'
    },
    emailIcon: {
        position: 'absolute',
        marginTop: 6
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        letterSpacing: 2,
        marginLeft: 4
    },
    textInputWrapper: {
        backgroundColor: 'white',
        elevation: 2,
        borderRadius: 60,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center'
    }
})