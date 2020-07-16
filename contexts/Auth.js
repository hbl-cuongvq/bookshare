import React, { Component } from 'react';
import {
    signInWithEmailAndPassword,
    signInWithGoogle,
    signInWithFacebook
} from '../api/user/signIn'
import { signOut } from '../api/user/signOut'
import * as SecureStore from 'expo-secure-store'
import { auth } from '../api/DBConfig'
import Toast from 'react-native-simple-toast'

export const AuthContext = React.createContext()

export class AuthProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isSignedIn: false,
            error: '',
            typeError: '',
        }

        this.setIsSignIn = this.setIsSignIn.bind(this)
    }

    setIsSignIn = isSignedIn => this.setState({ isSignedIn })

    setEmptyError = () => {
        this.setState({
            error: '',
            typeError: ''
        })
    }

    onSignIn = async (email, password) => {
        let error = null
        let typeError = null
        password === '' ? error = 'Password is empty!' : null
        password === '' ? typeError = 'password' : null
        email === '' ? error = 'Email is empty!' : null
        email === '' ? typeError = 'email' : null

        if (error === null) {
            await signInWithEmailAndPassword(email, password, this.setIsSignIn)
        } else {
            this.setState({
                error: error,
                typeError: typeError,
                isSignedIn: false
            })
        }

    }

    onSignInWithGoogle = async () => {
        try {
            await signInWithGoogle(this.setIsSignIn)
        } catch (err) {
            Toast.show(err)
        }
    }

    onSignInWithFacebook = async () => {
        try {
            let isSignedIn = await signInWithFacebook(this.setIsSignIn)
        } catch (err) {
            Toast.show(err)
        }
    }

    onSignOut = async () => {
        try {
            let isSignOut = await signOut()
            console.log('Signed out: ' + isSignOut)
            this.setState({
                isSignedIn: false
            })
        } catch (err) {
            Toast.show(err)
        }
    }

    render() {
        return (
            <AuthContext.Provider
                value={{
                    isSignedIn: this.state.isSignedIn,
                    error: this.state.error,
                    typeError: this.state.typeError,
                    onSignIn: this.onSignIn,
                    onSignInWithGoogle: this.onSignInWithGoogle,
                    onSignInWithFacebook: this.onSignInWithFacebook,
                    onSignOut: this.onSignOut,
                    setEmptyError: this.setEmptyError,
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}