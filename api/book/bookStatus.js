import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db, dbProps, auth } from '../DBConfig'

import {addMessage} from '../user/notification/notificationApi'

async function addSeen(bookId) {
    try {
        await db
            .collection('books')
            .doc(bookId)
            .update({
                seen: dbProps.FieldValue.increment(1)
            })
    } catch (err) {
        throw err
    }
}


async function addLike(bookId) {
    try {
        let book = db
            .collection('books')
            .doc(bookId)

        await book.update({
            like: dbProps.FieldValue.arrayUnion(auth.currentUser.uid)
        })

        let data = (await book.get()).data()
        let uid = auth.currentUser.uid
        let username = auth.currentUser.displayName
        let avatarUrl = auth.currentUser.photoURL
        let receiverId = data.uid
        if (receiverId !== uid) {
            let message = `${username} đã thích truyện: ${data.name}`
            await addMessage(message, receiverId, username, avatarUrl)
        }
    } catch (err) {
        throw err
    }
}


async function deleteLike(bookId) {
    try {
        await db
            .collection('books')
            .doc(bookId)
            .update({
                like: dbProps.FieldValue.arrayRemove(auth.currentUser.uid)
            })
    } catch (err) {
        throw err
    }
}


export { addSeen, addLike, deleteLike }