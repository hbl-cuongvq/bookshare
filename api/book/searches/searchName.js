import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../../DBConfig'
import Toast from 'react-native-simple-toast'

async function searchName(text, setDataFunction, setIsLoading) {
    try {
        text = text.slice(1).trim()

        db.collection('books')
            .where('publish', '==', true)
            .get()
            .then(snap => {
                let data = []
                snap.forEach(doc => {
                    if (doc.exists) {
                        if (doc.data().name.trim().toLowerCase().includes(text.trim().toLowerCase())) {
                            data.push({
                                id: doc.id,
                                data: doc.data()
                            })
                        }

                    }
                })
                setDataFunction(data)
                setIsLoading(false)
            })

    } catch (err) {
        Toast.show(err)
        return null
    }
}



export { searchName }