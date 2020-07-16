import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../../DBConfig'
import Toast from 'react-native-simple-toast'

async function searchAll(text, setDataFunction, setIsLoading) {
    try {
        db.collection('books')
            .where('author', '==', text)
            .onSnapshot(snap => {
                let data = []
                snap.forEach(doc => {
                    data.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setDataFunction(data)
                setIsLoading(false)
            })

    } catch (err) {
        Toast.show(err)
        return null
    }
}



export { searchAll }