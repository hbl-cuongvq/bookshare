import { storage, auth } from '../DBConfig'
import Toast from 'react-native-simple-toast'

async function uploadAvatar(imageSource) {
    if (imageSource) {
        if (imageSource.type === 'image') {

            let response = await fetch(imageSource.uri)
            let blob = await response.blob()

            // CREATE NEW
            try {
                let { uid } = auth.currentUser
                let ref = storage.ref().child(`users/${uid}/avatar/` + uid)
                await ref.put(blob)
                let url = await ref.getDownloadURL()
                if (url !== null) {
                    Toast.show('Uploaded image')
                    return url
                }

            } catch (err) {
                throw err
            }

        } else {
            throw 'Image invalid type!'
        }
    } else return null
}

async function uploadImage(imageSource, bookId, imageUrl) {
    if (imageSource) {
        if (imageSource.type === 'image') {

            let response = await fetch(imageSource.uri)
            let blob = await response.blob()

            // CREATE NEW
            try {
                let ref = storage.ref().child(`books/${bookId}/images/` + bookId)
                await ref.put(blob)
                let url = await ref.getDownloadURL()
                if (url !== null) {
                    Toast.show('Uploaded image')
                    return url
                }

            } catch (err) {
                throw err
            }

        } else {
            throw 'Image invalid type!'
        }
    } else return null
}

async function uploadImageChapter(imageSource, imageUrl, chapterId, bookId) {
    if (imageSource !== null) {
        if (imageSource.type === 'image') {

            let response = await fetch(imageSource.uri)
            let blob = await response.blob()

            // CREATE NEW
            try {
                let ref = storage.ref().child('books/' + `${bookId}/` + 'chapters/' + `${chapterId}/` + 'images/' + chapterId)
                await ref.put(blob)
                let url = await ref.getDownloadURL()
                if (url !== null) {
                    Toast.show('Uploaded image')
                    return url
                }

            } catch (err) {
                throw err
            }

        } else {
            throw 'Image invalid type!'
        }
    } else return null
}

export { uploadImage, uploadImageChapter, uploadAvatar }