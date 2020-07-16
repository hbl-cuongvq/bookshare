import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { auth, db } from '../DBConfig'

async function getUserDraftBooks(getBooks) {
    try {
        let { uid } = auth.currentUser

        db.collection('books')
            .where('uid', '==', uid)
            .where('publish', '==', false)
            .onSnapshot(snap => {
                let books = []
                snap.forEach(doc => {
                    books.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                books.sort((a, b) => a.data.created > b.data.created)
                getBooks(books)
            })

        return true
    } catch (err) {
        console.log(err)
        return false
    }

}

async function getUserPublishBook(getBooks) {
    try {
        let { uid } = auth.currentUser

        db.collection('books')
            .where('uid', '==', uid)
            .where('publish', '==', true)
            .onSnapshot(snap => {
                let books = []
                snap.forEach(doc => {
                    books.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                books.sort((a, b) => a.data.created > b.data.created)
                getBooks(books)
            })

        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

export { getUserDraftBooks, getUserPublishBook }