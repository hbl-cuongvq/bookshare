import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {db, dbProps} from '../DBConfig'
import Toast from 'react-native-simple-toast'
import { uploadImageChapter } from './uploadImage'
import { uploadAudio } from './uploadAudio'

async function createChapter(name, content, image, audio, bookId, uid) {
    // CREATE CHATER 
    let result = await db.collection('books').doc(bookId)
        .collection('chapters').add({
            name: name,
            content: content,
            uid: uid,
            bookId: bookId,
            created: dbProps.FieldValue.serverTimestamp(),
            lastEdited: dbProps.FieldValue.serverTimestamp()
        })

    if (result) {
        try {
            // add chapter id to book info
            await db.collection('books')
                .doc(bookId)
                .update({
                    chapter: dbProps.FieldValue.arrayUnion(result.id)
                })


            // UPLOAD IMAGE
            let urlImage = await uploadImageChapter(image, null, result.id, bookId)
            await result.update({imageUrl: urlImage})


            // UPLOAD AUDIO
            let urlAudio = await uploadAudio(audio, null, result.id, bookId)
            await result.update({audioUrl: urlAudio})

            return result
        } catch (err) {
            Toast.show(err, {
                textStyle: {
                    lineHeight: 20
                }
            })
            return null
        }
        
    } else {
        return null
    }
}

export { createChapter }