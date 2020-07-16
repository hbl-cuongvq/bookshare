import { auth, authProps, db, dbProps } from '../DBConfig'
import Toast from 'react-native-simple-toast'
import * as Google from 'expo-google-app-auth'
import * as Facebook from 'expo-facebook'
import * as SecureStore from 'expo-secure-store'

// SIGNIN WITH EMAIL AND PASSWORD
async function signInWithEmailAndPassword(email, password, setIsSignIn) {
    // after validate email and password
    await auth.signInWithEmailAndPassword(email, password)
        .then(async result => {
            setIsSignIn(true)
            await SecureStore.setItemAsync('typeAccount', 'email')
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            Toast.show(errorMessage);
            isSignedIn = false
        })
}

// SIGNIN WITH GOOGLE ACCOUT

async function signInWithGoogle(setSignIn) {
    try {
        const googleUser = await Google.logInAsync({
            androidStandaloneAppClientId: '807345330467-6dp2ehqj3i3t9k4cbfooosqaf8qvds5u.apps.googleusercontent.com',
            androidClientId: '807345330467-itljvb0u7t8gnbuegtonssicj15cphoi.apps.googleusercontent.com',
            // iosClientId: YOUR_CLIENT_ID_HERE,
            scopes: ['profile', 'email']
        })

        if (googleUser.type === 'success') {
            var unsubscribe = auth.onAuthStateChanged(function (firebaseUser) {
                unsubscribe()
                // Check if we are already signed-in Firebase with the correct user.
                let isUserExist = null
                if (firebaseUser) {
                    var providerData = firebaseUser.providerData
                    for (var i = 0; i < providerData.length; i++) {
                        if (providerData[i].providerId === authProps.GoogleAuthProvider.PROVIDER_ID &&
                            providerData[i].uid === googleUser.user.id) {
                            // We don't need to reauth the Firebase connection.
                            isUserExist = true
                        }
                    }
                }
                else {
                    isUserExist = false
                }
                if (!isUserExist) {
                    // Build Firebase credential with the Google ID token.
                    var credential = authProps.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    )
                    // Sign in with credential from the Google user.
                    auth.signInWithCredential(credential)
                        .then(function (result) {
                            let user = db.collection('users')
                                .doc(result.user.uid)

                            user.get().then(doc => {
                                if (!doc.exists) {
                                    user.set({
                                        'type': 'googleAccount',
                                        'created': dbProps.FieldValue.serverTimestamp(),
                                        'avatarUrl': result.user.photoURL
                                    }).then(function () {
                                        console.log('User signed in!')
                                        setSignIn(true)
                                    }).catch(err => { throw err })
                                }
                                else {
                                    console.log('User already signed-in Firebase.')
                                    setSignIn(true)
                                }
                            }).catch(err => { throw err.message })
                        })
                        .catch(function (error) {
                            var errorMessage = error.message
                            throw errorMessage
                        })
                }
                else {
                    console.log('User already signed-in Firebase.')
                    setSignIn(true)
                }
            })
            await SecureStore.setItemAsync('typeAccount', 'google')
        } else {
            setSignIn(false)
        }
    } catch (e) {
        throw e
    }
}

async function signInWithFacebook(setSignIn) {
    const isUserEqual = async (facebookUser) => {
        let user = await db.collection('users').doc(facebookUser.user.uid).get()
        if (user.exists) {
            return true
        }
        return false
    }
    try {
        await Facebook.initializeAsync('969510633494474')
        const {
            type,
            token
        } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile']
        })

        await SecureStore.setItemAsync('typeAccount', 'facebook')

        if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const credential = authProps.FacebookAuthProvider.credential(token)

            await auth.signInWithCredential(credential)
                .then(async result => {
                    // Sign in success
                    let isUserExist = await isUserEqual(result)
                    if (!isUserExist) {
                        let user = db.collection('users')
                            .doc(result.user.uid)

                        user.get().then(doc => {
                            if (!doc.exists) {
                                user.set({
                                    'type': 'facebookAccount',
                                    'created': dbProps.FieldValue.serverTimestamp(),
                                    'avatarUrl': result.user.photoURL
                                }).then(function () {
                                    console.log('User signed in!')
                                    setSignIn(true)
                                })
                            }
                        })
                    } else {
                        console.log('User already signed-in Firebase.')
                        setSignIn(true)
                    }
                })
                .catch(err => {
                    throw err
                })
        } else {
            // type === 'cancel'
            setSignIn(false)
        }
    } catch ({ message }) {
        throw message
    }
}


// SIGNIN WITH FACEBOOK ACCOUT

export { signInWithEmailAndPassword, signInWithGoogle, signInWithFacebook }