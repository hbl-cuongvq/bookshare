import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../DBConfig'

async function getBookWithCategory(category, getBookToCategoryFunction) {
    try {
        db
            .collection('books')
            .where('categories', 'array-contains', category)
            .where('publish', '==', true)
            .limit(10)
            .onSnapshot(snap => {
                let books = []
                snap.forEach(doc => {
                    books.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                books = books.sort((a, b) => a.data.created.seconds < b.data.created.seconds)
                getBookToCategoryFunction(category, books)
            })
    } catch (err) {
        throw err
    }
}

export { getBookWithCategory }