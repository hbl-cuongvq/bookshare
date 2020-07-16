import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import Toast from 'react-native-simple-toast'

import { db } from '../DBConfig'

async function getBookChapter(bookId, getChapters) {
    try {
        db.collection('books').doc(bookId)
            .collection('chapters')
            .where('bookId', '==', bookId)
            .onSnapshot(snap => {
                let chapters = []
                snap.forEach(doc => {
                    chapters.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                chapters.sort((a, b) => a.data.created > b.data.created)
                getChapters(chapters)
            })
    } catch (err) {
        Toast.show(err)
        return null
    }
}

export { getBookChapter }