import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import Toast from 'react-native-simple-toast'

async function searchLibrary(text) {
    try {
        console.log(text)
    } catch (err) {
        Toast.show(err)
        return null
    }
}

export { searchLibrary }