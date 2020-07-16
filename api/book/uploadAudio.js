import { storage } from '../DBConfig'
import Toast from 'react-native-simple-toast'

async function uploadAudio(audioSource, audioUrl, chapterId, bookId) {
    if (audioSource) {
        let response = await fetch(audioSource.uri)
        let blob = await response.blob()

        // // DELETE OLD FILE
        // if (audioUrl) {
        //     try {
        //         let ref = await storage.ref().child(`books/${bookId}/chapters/${chapterId}/audio/` + chapterId)
        //         if (ref) await ref.delete()
        //     } catch (err) {
        //         Toast.show(err)
        //         return null
        //     }
        // }

        // CREATE NEW
        try {
            let ref = storage.ref().child(`books/${bookId}/chapters/${chapterId}/audio/` + chapterId)
            await ref.put(blob)
            let url = await ref.getDownloadURL()
            if (url) {
                Toast.show('Uploaded audio')
                console.log(url)
                return url
            }

        } catch (err) {
            Toast.show(err)
            return null
        }
    } else return null
}

export { uploadAudio }