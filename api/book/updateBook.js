import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {db, dbProps} from '../DBConfig'
import { uploadImage } from './uploadImage'

async function updateBook(name, description, image, imageUrl, bookId) {
    let updated = false
    // UPDATE NEW BOOK 
    try {
        let result = await db.collection('books').doc(bookId)
        let data = (await result.get()).data()
        if (data.name === name && data.description === description && imageUrl !== null && image === null) {
            throw 'Nothing to update!'
        }

        // UPLOAD IMAGE
        if (image !== null) {
            try {
                let url = await uploadImage(image, result.id, imageUrl)
                if (url !== null) {
                    await result.update({
                        imageUrl: url
                    })
                    updated = true
                }
            } catch (err) {
                throw err
            }
        }

        // UPLOAD ANOTHER INFO
        try {
            if (data.name !== name) { await result.update({ name: name }); updated = true }
            if (data.description !== name) { await result.update({ description: description }); updated = true }
        } catch (err) {
            throw err
        }

        if (updated) {
            await result.update({
                lastEdited: dbProps.FieldValue.serverTimestamp()
            })
            return result
        }
    } catch (err) {
        throw err
    }

}

export { updateBook }