import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../DBConfig'

async function updateCategoriesAndTags(categories, tags, bookId) {
    if (categories.length === 0 && tags.length === 0) throw 'Nothing to update!'
    try {
        await db.collection('books')
            .doc(bookId)
            .update({
                categories: categories,
                tags: tags
            })
        return
    } catch (err) {
        throw err
    }
}

export { updateCategoriesAndTags }