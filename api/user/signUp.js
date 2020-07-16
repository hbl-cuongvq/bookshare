import {auth, dbProps, db} from '../DBConfig'
import Toast from 'react-native-simple-toast'

async function createUserWithEmailAndPassword(email, password, username) {
    // after validate email and password
    try {
        let result = await auth.createUserWithEmailAndPassword(email, password)
        if (result) {
            let { uid } = result.user
            await db
                .collection('users')
                .doc(uid).set({
                    'created': dbProps.FieldValue.serverTimestamp()
                })

            await result.user.updateProfile({
                displayName: username
            })
        }
        Toast.show('Created!')
    } catch (err) {
        Toast.show(err)
    }
}

export { createUserWithEmailAndPassword }