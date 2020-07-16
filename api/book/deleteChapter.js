import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {db, dbProps} from '../DBConfig'

async function deleteChapter(chapterId, bookId) {
    try {
        await db
            .collection('books')
            .doc(bookId)
            .update({
                chapter: dbProps.FieldValue.arrayRemove(chapterId)
            })
        await db
            .collection('books')
            .doc(bookId)
            .collection('chapters')
            .doc(chapterId).delete()
        return true
    } catch (err) {
        throw err
    }
}

export { deleteChapter }