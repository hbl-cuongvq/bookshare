import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {db, auth} from '../DBConfig'

async function updateAuthor(author, bookId) {
    try {
        await db.collection('books')
            .doc(bookId)
            .update({
                author: author,
                authorTag: auth.currentUser.displayName
            })
        return
    } catch(err) {
        throw err
    }
}

export { updateAuthor }