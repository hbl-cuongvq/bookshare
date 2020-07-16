import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db, dbProps, auth } from '../DBConfig'

import {
    addMessage
} from './notification/notificationApi'

async function addReadBook(bookId) {
    try {
        await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .update({
                readingBookId: dbProps.FieldValue.arrayUnion(bookId)
            })
    } catch (err) {
        throw err
    }
}

async function addStoreBook(bookId) {
    try {
        await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .update({
                storeBookId: dbProps.FieldValue.arrayUnion(bookId)
            })
    } catch (err) {
        throw err
    }
}

async function deleteStoreBook(bookId) {
    try {
        await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .update({
                storeBookId: dbProps.FieldValue.arrayRemove(bookId)
            })
    } catch (err) {
        throw err
    }
}

async function deleteReadingBook(bookId) {
    try {
        await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .update({
                readingBookId: dbProps.FieldValue.arrayRemove(bookId)
            })
    } catch (err) {
        throw err
    }
}


export { addReadBook, deleteStoreBook, addStoreBook, deleteReadingBook }