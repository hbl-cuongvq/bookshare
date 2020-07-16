import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {db} from '../DBConfig'

async function deleteBook(bookId) {
    try {
        await db.collection('books').doc(bookId).delete()
        return true
    } catch (err) {
        throw err
    }
}

export { deleteBook }