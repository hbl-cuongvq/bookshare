import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Dimensions,
    StatusBar,
    ActivityIndicator
} from 'react-native'

import Svg, {
    G,
    Ellipse
} from 'react-native-svg'


import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick"

import { SocialIcon } from 'react-native-elements'


import Modal from 'react-native-modal'

import { AuthContext } from '../contexts/Auth'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Toast from 'react-native-root-toast'

const { width } = Dimensions.get('screen')
const { height } = Dimensions.get('screen')

const borderColor = {
    active: 'rgba(244, 67, 54, 1)',
    inActive: 'rgba(0, 0, 0, 0.32)'
}

export default class SignIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            email: '',
            password: '',
            securityPassword: true,
            emailBorderColor: borderColor.inActive,
            passwordBorderColor: borderColor.inActive
        }

        this.emailRef = React.createRef()
        this.passwordRef = React.createRef()

        this.setIsLoading = this.setIsLoading.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
    }

    setIsLoading = isLoading => this.setState({ isLoading })

    onChangeText = (text) => {
        if (this.emailRef.current.isFocused()) {
            this.setState({
                email: text
            })
        }

        if (this.passwordRef.current.isFocused()) {
            this.setState({
                password: text
            })
        }
    }

    changeSecurityPassword = () => {
        this.setState({
            securityPassword: !this.state.securityPassword
        })
    }

    FocusBorderColor = () => {
        if (this.emailRef.current.isFocused()) {
            this.setState({
                emailBorderColor: borderColor.active
            })
        }

        if (this.passwordRef.current.isFocused()) {
            this.setState({
                passwordBorderColor: borderColor.active
            })
        }
    }

    EndEditingBorderColor = () => {
        if (!this.emailRef.current.isFocused()) {
            this.setState({
                emailBorderColor: borderColor.inActive
            })
        }

        if (!this.passwordRef.current.isFocused()) {
            this.setState({
                passwordBorderColor: borderColor.inActive
            })
        }
    }

    render() {
        const {
            email,
            password,
            securityPassword,
            isLoading
        } = this.state

        return (
            <View
                style={styles.container}
            >
                <StatusBar hidden={true} />
                <KeyboardAvoidingView
                    behavior='position'
                    style={{
                        padding: 16
                    }}
                >

                    <View style={[StyleSheet.absoluteFill], {
                        position: 'absolute',
                        left: -147,
                        top: -130
                    }}>
                        <Svg width="1088" height="1269" viewBox="0 0 1088 1269">
                            <G transform="translate(147 112)">
                                <Ellipse class="a" cx="119.5" cy="119" rx="119.5" ry="119" transform="translate(-86 277)" fill="#e9e9e9" />
                                <Ellipse class="b" cx="407" cy="266.5" rx="407" ry="266.5" transform="translate(-101 -112)" fill="#fff" />
                                <Ellipse class="a" cx="544" cy="413.5" rx="544" ry="413.5" transform="translate(-147 330)" fill="#e9e9e9" />
                            </G>
                        </Svg>
                    </View>

                    <Image
                        style={{
                            width: 123 / 360 * width,
                            height: 123 / 360 * width,
                            marginTop: 25,
                            marginBottom: 26,
                            alignSelf: 'center'
                        }}
                        source={require('../assets/logo.png')}

                    />

                    {/* LOGIN WITH OTHER SOCIAL MEDIA APP */}
                    <AuthContext.Consumer>
                        {
                            ({ onSignInWithGoogle, onSignInWithFacebook }) => (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        marginTop: 36,
                                        marginBottom: 26
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={onSignInWithFacebook}
                                    >
                                        <SocialIcon
                                            title='Facebook'
                                            button
                                            type='facebook'
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={async () => {
                                            this.setIsLoading(true)
                                            try {
                                                await onSignInWithGoogle()
                                            } catch (err) {
                                                Toast.show(err)
                                            }
                                            this.setIsLoading(false)
                                        }}
                                    >
                                        <SocialIcon
                                            title='Google'
                                            button
                                            light
                                            type='google'
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </AuthContext.Consumer>

                    <AuthContext.Consumer>
                        {
                            ({ setEmptyError }) => (
                                <View>
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
                                            onFocus={() => { this.FocusBorderColor(); setEmptyError() }}
                                            onEndEditing={this.EndEditingBorderColor}
                                        />
                                    </View>


                                    {/* PASSWORD TEXTINPUT */}
                                    <View
                                        style={[styles.textInputWrapper, { marginBottom: 8 }]}
                                    >
                                        <MaterialIcons
                                            name={securityPassword ? 'lock' : 'lock-open'}
                                            size={24}
                                            color={this.state.passwordBorderColor}
                                        />
                                        <TextInput
                                            ref={this.passwordRef}
                                            onChangeText={text => this.onChangeText(text)}
                                            value={password}
                                            style={[styles.textInput, { color: this.state.passwordBorderColor }]}
                                            placeholder='Mật khẩu'
                                            placeholderTextColor={borderColor.inActive}
                                            onFocus={() => { this.FocusBorderColor(); setEmptyError() }}
                                            onEndEditing={this.EndEditingBorderColor}
                                            secureTextEntry={securityPassword}
                                        />
                                        <FontAwesome5
                                            name={securityPassword ? 'eye' : 'eye-slash'}
                                            size={16}
                                            style={[styles.eyeIcon, { color: this.state.passwordBorderColor }]}
                                            onPress={this.changeSecurityPassword}
                                        />
                                    </View>
                                </View>
                            )
                        }
                    </AuthContext.Consumer>

                    <AuthContext.Consumer>
                        {
                            ({ error }) =>
                                <Text
                                    style={styles.error}
                                >{error}</Text>
                        }
                    </AuthContext.Consumer>

                </KeyboardAvoidingView>

                <View
                    style={{
                        paddingHorizontal: 16
                    }}
                >
                    {/* SIGNIN BUTTON */}
                    <AuthContext.Consumer>
                        {
                            ({ onSignIn }) =>
                                <AwesomeButtonRick
                                    backgroundColor='rgba(244, 67, 54, 1)'
                                    backgroundDarker='lightgray'
                                    backgroundShadow='transparent'
                                    backgroundProgress='rgba(0,0,0,0.32)'
                                    stretch={true}
                                    progress={true}
                                    onPress={async (next) => {
                                        try {
                                            await onSignIn(email, password)
                                        } catch (err) {
                                            Toast.show(err)
                                        }
                                        next()
                                    }}
                                    springRelease={true}
                                >
                                    <Text style={styles.signInButtonText}>ĐĂNG NHẬP</Text>
                                </AwesomeButtonRick>
                        }
                    </AuthContext.Consumer>
                    {/* signInButton: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginBottom: 4,
                    backgroundColor: 'rgba(244, 67, 54, 1)',
                    borderRadius: 7
                } */}


                    {/* FORGOT PASSWORD LINK
                    <TouchableOpacity
                        style={styles.link}
                        onPress={() => this.props.navigation.navigate('ForgotPassword')}
                    >

                    </TouchableOpacity> */}

                    <View style={{
                        flexDirection:'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 24
                    }}>
                        <Text style={{color: 'rgba(0,0,0,0.54)'}}>Bạn không có tài khoản? </Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        >
                            <Text style={{color: borderColor.active, fontWeight: 'bold'}}>Hãy đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                    {/* SIGNUP LINK */}
                </View>

                <Modal
                    visible={isLoading}
                    hasBackdrop
                    style={{
                        flex: 1,
                        margin: 0,
                        backgroundColor: 'white',
                        opacity: 0.7,
                    }}
                >
                    <ActivityIndicator
                        size='small'
                    />
                </Modal>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    circle: {
        backgroundColor: 'white',
        width: 450 / 360 * width,
        height: 450 / 360 * width,
        borderRadius: 450 / 360 * width,
        position: 'absolute',
        left: -100 / 360 * width,
        top: -20 / 640 * height

    },
    socialButton: {
        flex: 1,
        height: 59,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        elevation: 2,
        flexDirection: 'row'
    },
    facebook: {
        backgroundColor: 'rgba(24, 115, 194, 1)',
        marginRight: 10
    },
    google: {
        backgroundColor: 'white'
    },
    socialText: {
        fontSize: 14,
        marginLeft: 8
    },
    facebookText: {
        color: 'white',
        letterSpacing: 2
    },
    googleText: {
        color: 'rgba(0, 0, 0, 0.87)',
        letterSpacing: 2
    },
    signInButtonText: {
        color: 'white',
        fontSize: 14,
        letterSpacing: 2
    },
    link: {
        alignItems: 'center',
        marginTop: 18,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    forgotPassText: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpText: {
        fontSize: 14,
        color: 'rgba(244, 67, 54, 1)'
    },
    error: {
        color: 'red',
        fontSize: 10,
        alignSelf: 'center',
        marginBottom: 40
    },
    eyeIcon: {
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