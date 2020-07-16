import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {db, dbProps} from '../DBConfig'

import { uploadImage } from './uploadImage'

async function createBook(name, description, image, uid) {
    try {
        // CREATE NEW BOOK 
        let result = await db.collection('books').add({
            name: name,
            description: description,
            uid: uid,
            created: dbProps.FieldValue.serverTimestamp(),
            lastEdited: dbProps.FieldValue.serverTimestamp(),
            publish: false
        })

        if (result) {
            // UPLOAD IMAGE
            if (image) {
                let url = await uploadImage(image, result.id, null)
                if (url !== null) {
                    await result.update({ imageUrl: url })
                } else throw 'Cannot upload image!'
            }

            return result
        } else {
            throw 'Cannot get data!'
        }
    } catch (err) {
        throw err
    }
}

export { createBook }