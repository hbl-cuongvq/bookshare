import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {
    db,
    dbProps
} from '../DBConfig'
import Toast from 'react-native-simple-toast'

import {
    addMessage
} from '../user/notification/notificationApi'

// BOOK 
// add new Comment to book
async function addNewCommentToBook(content, bookId, uid, username, avatarUrl) {
    try {
        let book = db.collection('books').doc(bookId)

        let docRef = await book
            .collection('comments')
            .add({
                'content': content,
                'created': dbProps.FieldValue.serverTimestamp(),
                'uid': uid,
                'username': username,
                'avatarUrl': avatarUrl
            })


        let data = (await book.get()).data()
        let receiverId = data.uid
        if (receiverId !== uid) {
            let message = `${username} đã bình luận: ${content}`
            await addMessage(message, receiverId, username, avatarUrl)
        }
        return {
            id: docRef.id,
            data: (await (await docRef).get()).data()
        }
    } catch (err) {
        throw err.message
    }
}


// get all Comment from book
async function getAllCommentFromBook(bookId, currentDataLength) {
    try {
        if (currentDataLength == 0) {
            let comments = await db.collection('books').doc(bookId)
                .collection('comments')
                .orderBy('created', 'desc')
                .limit(10)
                .get()

            if (comments && comments.size > 0) {
                let data = []
                comments.forEach(doc => {
                    data.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                let end = false
                if (comments.size < 10) {
                    end = true
                }

                return {
                    data: data,
                    end: end
                }
            } else {
                return {
                    data: [],
                    end: true
                }
            }
        } else {
            console.log('get more comment')
            const first = await db.collection('books')
                .doc(bookId)
                .collection('comments')
                .orderBy('created', 'desc')
                .limit(currentDataLength)
                .get()
            const last = first.docs[first.docs.length - 1]

            const next = await db.collection('books')
                .doc(bookId)
                .collection('comments')
                .orderBy('created', 'desc')
                .startAfter(last)
                .limit(10)
                .get()

            if (next && next.size > 0) {
                let data = []
                next.forEach(doc => {
                    data.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                let end = false
                if (next.size < 10) {
                    end = true
                }

                return {
                    data: data,
                    end: end
                }
            } else {
                return {
                    data: [],
                    end: true
                }
            }
        }
    } catch (err) {
        throw err.message
    }
}


// CHAPTER




// export
export { addNewCommentToBook, getAllCommentFromBook }