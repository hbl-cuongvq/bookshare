import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../DBConfig'

async function getChapterToRead(bookId, setChaptersFunction) {
    try {
        db.collection('books')
            .doc(bookId)
            .collection('chapters')
            .orderBy('lastEdited', 'asc')
            .onSnapshot(snap => {
                let data = []
                snap.forEach(doc => {
                    data.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setChaptersFunction(data)
            })
    } catch (err) {
        throw err
    }
}

export { getChapterToRead }