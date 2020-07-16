import {db} from '../DBConfig'
import Toast from 'react-native-simple-toast'

async function checkBookExist(bookId) {
    try {
        let book = await db.collection('books').doc(bookId).get()

        if (book.exists) {
            return true
        } else {
            return false
        }
    } catch(err) {
        throw err.message
    }
}

export { checkBookExist }