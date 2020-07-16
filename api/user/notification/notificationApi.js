import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import {
    db,
    dbProps,
    auth
} from '../../DBConfig'
import Toast from 'react-native-simple-toast'
import { not } from 'react-native-reanimated'

// add
async function addMessage(content, receiverId, senderName, avatarUrl) {
    try {
        await db.collection('users')
            .doc(receiverId)
            .collection('notifications')
            .add({
                'created': dbProps.FieldValue.serverTimestamp(),
                'seen': false,
                'senderName': senderName,
                'content': content,
                'avatarUrl': avatarUrl
            })
    } catch (error) {
        throw error.message
    }
}

async function setSeen(notiId) {
    try {
        let uid = auth.currentUser.uid
        await db.collection('users').doc(uid)
            .collection('notifications')
            .doc(notiId)
            .update({
                'seen': true
            })
    } catch {
        throw error.message
    }
}

// delete
async function deleteMessage(notiId) {
    try {
        let uid = auth.currentUser.uid
        await db.collection('users').doc(uid)
            .collection('notifications')
            .doc(notiId)
            .delete()
    } catch (error) {
        console.log(error)
        throw error
    }
}

// get All
async function getAllMessage(setMessages) {
    try {
        let uid = auth.currentUser.uid
        db.collection('users')
            .doc(uid)
            .collection('notifications')
            .orderBy('created', 'desc')
            .onSnapshot(snap => {
                let data = []
                if (snap && snap.size > 0) {
                    snap.forEach(doc => {
                        data.push({
                            id: doc.id,
                            data: doc.data()
                        })
                    })
                }
                setMessages(data)
            })

    } catch (error) {
        throw error.message
    }
}


// export
export { addMessage, deleteMessage, getAllMessage, setSeen }