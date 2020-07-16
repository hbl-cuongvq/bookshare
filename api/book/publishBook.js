import { db } from '../DBConfig'
import Toast from 'react-native-simple-toast'

async function publishBook(selectedBookId, tags, categories) {
    try {
        let result = db
            .collection('books')
            .doc(selectedBookId)

        if (result) {
            if (tags.length > 0 && categories.length > 0) {
                result.update({
                    tags: tags,
                    categories: categories
                })
            }

            result.update({
                publish: true
            })
        }
        Toast.show('Published!')
        return result
    } catch (err) {
        throw err
    }
}

async function unPublishBook(selectedBookId) {
    try {
        let result = db
            .collection('books')
            .doc(selectedBookId)

        if (result) {
            result.update({
                publish: false,
            })
        }
        Toast.show('Un Published!')
        return result
    } catch (err) {
        throw err
    }
}

export { unPublishBook, publishBook }