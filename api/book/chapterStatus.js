import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {auth, db, dbProps} from '../DBConfig'

async function addReadsChapter(bookId, chapterId) {
    try {
        await db
            .collection('books')
            .doc(bookId)
            .collection('chapters')
            .doc(chapterId)
            .update({
                reads: dbProps.FieldValue.increment(1)
            })
    } catch (err) {
        throw err
    }
}


async function addLikesChapter(bookId, chapterId) {
    try {
        await db
            .collection('books')
            .doc(bookId)
            .collection('chapters')
            .doc(chapterId)
            .update({
                likes: dbProps.FieldValue.arrayUnion(auth.currentUser.uid)
            })
    } catch (err) {
        throw err
    }
}


async function deleteLikesChapter(bookId, chapterId) {
    try {
        await db
            .collection('books')
            .doc(bookId)
            .collection('chapters')
            .doc(chapterId)
            .update({
                likes: dbProps.FieldValue.arrayRemove(auth.currentUser.uid)
            })
    } catch (err) {
        throw err
    }
}


export { addReadsChapter, addLikesChapter, deleteLikesChapter }