import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../DBConfig'

async function getBestBook(setBestBookFunction) {
    try {
        db
            .collection('books')
            .orderBy('seen', 'desc')
            .limit(1)
            .onSnapshot(snap => {
                data = null
                snap.forEach(doc => {
                    data = {
                        id: doc.id,
                        data: doc.data()
                    }
                })
                setBestBookFunction(data)
            })
    } catch (err) {
        throw err
    }
}

export { getBestBook }