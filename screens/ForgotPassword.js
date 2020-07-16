import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image
} from 'react-native'

const borderColor = {
    active: 'rgba(244, 67, 54, 1)',
    inActive: 'rgba(0, 0, 0, 0.54)'
}

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            emailBorderColor: borderColor.inActive,
        }

        this.emailRef = React.createRef()

        this.onChangeText = this.onChangeText.bind(this)
    }

    onChangeText = (text) => {
        if (this.emailRef.current.isFocused()) {
            this.setState({
                email: text
            })
        }
    }

    FocusBorderColor = () => {
        if (this.emailRef.current.isFocused()) {
            this.setState({
                emailBorderColor: borderColor.active
            })
        }
    }

    render() {
        const {
            email,
            emailBorderColor
        } = this.state

        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior='position'
            >

                {/* LOGO */}
                <Image
                    style={{
                        width: 123,
                        height: 123,
                        marginTop: 25,
                        marginBottom: 26,
                        alignSelf: 'center'
                    }}
                    source={require('../assets/logo.png')}
                />

                {/* EMAIL TEXTINPUT */}
                <TextInput
                    ref={this.emailRef}
                    onChangeText={text => this.onChangeText(text)}
                    value={email}
                    style={[styles.textInput, { borderBottomColor: emailBorderColor }]}
                    placeholder='Nhập email đã đăng ký tài khoản'
                    placeholderTextColor='rgba(0, 0, 0, 0.54)'
                    onFocus={this.FocusBorderColor}
                    onEndEditing={this.EndEditingBorderColor}
                />

                {/* CONFIRM BUTTON */}
                <TouchableOpacity
                    style={styles.signInButton}
                >
                    <Text style={styles.signInButtonText}>GỬI EMAIL</Text>
                </TouchableOpacity>

                {/* SIGNIN LINK */}
                <TouchableOpacity
                    style={[{ marginBottom: 32 }, styles.link]}
                    onPress={() => this.props.navigation.navigate('SignIn')}
                >
                    <Text style={styles.signUpText}>Đăng nhập lại?</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginLeft: 16,
        marginRight: 16
    },
    textInput: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 25,
        borderBottomWidth: 1,
        paddingBottom: 8,
        paddingTop: 4,
        paddingLeft: 8
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
        fontSize: 14
    },
    link: {
        alignItems: 'center',
        marginTop: 18
    },
    signUpText: {
        fontSize: 14,
        color: 'rgba(244, 67, 54, 1)'
    }
})