import {auth} from '../DBConfig'
import * as SecureStore from 'expo-secure-store'
import Toast from 'react-native-simple-toast'

async function signOut() {
    let signOut = true
    try {
        await auth.signOut()
        await SecureStore.deleteItemAsync('typeAccount')
    } catch (error) {
        signOut = false
        throw error.message
    }
    
    return signOut
}

export { signOut }