import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db, auth } from '../DBConfig'

const getData = async (bookIdArr) => {
    let data = []
    if (bookIdArr) {
        for (let i = 0; i < bookIdArr.length; i++) {
            let book = await db.collection('books').doc(bookIdArr[i]).get()
            if (book.exists) {
                if (book.data().publish === true) {
                    data.push({
                        id: book.id,
                        data: book.data()
                    })
                }
                
            }
        }
    }

    return data
}

async function getReadingBookLibrary(setBooks) {
    try {
        let { uid } = auth.currentUser
        db.collection('users').doc(uid)
            .onSnapshot(async snap => {
                if (snap.exists) {
                    let bookIdArr = snap.data().readingBookId
                    let data = await getData(bookIdArr)
                    setBooks(data)
                } else setBooks([])
            })
    } catch (err) {
        throw err
    }
}

async function getStoreBookLibrary(setBooks) {
    try {
        let { uid } = auth.currentUser
        db.collection('users').doc(uid)
            .onSnapshot(async snap => {
                if (snap.exists) {
                    let bookIdArr = snap.data().storeBookId
                    let data = await getData(bookIdArr)
                    setBooks(data)
                } else setBooks([])
            })
    } catch (err) {
        throw err
    }
}

export { getReadingBookLibrary, getStoreBookLibrary }