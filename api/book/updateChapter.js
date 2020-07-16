import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {db, dbProps} from '../DBConfig'

import Toast from 'react-native-simple-toast'
import { uploadImageChapter } from './uploadImage'
import { uploadAudio } from './uploadAudio'

async function updateChapter(name, content, image, imageUrl, audio, audioUrl, bookId, currentChapter) {
    let updated = false
    // UPDATE
    try {
        let result = db.collection('books').doc(bookId).collection('chapters').doc(currentChapter.id)
        let data = (await result.get()).data()
        if (data.name === name && data.content === content && imageUrl !== null && image === null && audio === null & audioUrl !== null) {
            Toast.show('Nothing to update!')
            return null
        }

        // UPLOAD IMAGE
        if (image !== null) {
            try {
                let url = await uploadImageChapter(image, imageUrl, result.id, bookId)
                if (url !== null) {
                    await result.update({
                        imageUrl: url
                    })
                    updated = true
                }
            } catch (err) {
                Toast.show(err)
                return null
            }
        }

        // UPLOAD AUDIO
        if (audio !== null) {
            try {
                let url = await uploadAudio(audio, audioUrl, result.id, bookId)
                if (url !== null) {
                    await result.update({
                        audioUrl: url
                    })
                    updated = true
                }
            } catch (err) {
                Toast.show(err)
                return null
            }
        } else {
            await result.update({
                audioUrl: null
            })
            updated = true 
        }

        // UPLOAD ANOTHER INFO
        try {
            if (data.name !== name) { await result.update({ name: name }); updated = true }
            if (data.content !== name) { await result.update({ content: content }); updated = true }
        } catch (err) {
            Toast.show(err)
            return null
        }

        if (updated) {
            await result.update({
                lastEdited: dbProps.FieldValue.serverTimestamp()
            })
            return result
        }
    } catch (err) {
        Toast.show(err)
        return null
    }
}

export { updateChapter }