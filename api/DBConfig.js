import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCpTosHsAp1To2qFCX4BCiwAJ8nlYlk-lM",
    authDomain: "book-share-93194.firebaseapp.com",
    databaseURL: "https://book-share-93194.firebaseio.com",
    projectId: "book-share-93194",
    storageBucket: "book-share-93194.appspot.com",
    messagingSenderId: "807345330467",
    appId: "1:807345330467:web:19f28dff72969a3177d496",
    measurementId: "G-M05252G3N5"
};


firebase.initializeApp(firebaseConfig)

const dbProps = firebase.firestore
const authProps = firebase.auth
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, dbProps, authProps, storage }