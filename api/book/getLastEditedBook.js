import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../DBConfig'

async function getLastEditedBook(uid, setLastEditedBookFunction) {
    try {
        db
            .collection('books')
            .where('uid', '==', uid)
            .orderBy('lastEdited', 'desc')
            .limit(1)
            .get()
            .then(snap => {
                data = null
                snap.forEach(doc => {
                    data = ({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setLastEditedBookFunction(data)
            })
    } catch (err) {
        throw err
    }
}

export { getLastEditedBook }