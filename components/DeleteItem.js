import React, { Component } from 'react';
import {
    Alert,
    TouchableOpacity
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'
import { deleteStoreBook, deleteReadingBook } from '../api/user/addReadBookLibrary'
import Toast from 'react-native-simple-toast';

export default class DeleteItem extends Component {
    deleteBook = async () => {
        const { screen, bookId } = this.props
        try {
            if (screen === 'store') {
                await deleteStoreBook(bookId)
            }
            if (screen === 'reading') {
                await deleteReadingBook(bookId)
            }

            Toast.show('Book deleted!')
        } catch (err) {
            Toast.show(err)
        }
    }

    deleteConfirm = () => {
        const { item, type, deleteNotification } = this.props

        let title, content
        title = "Xác nhận"
        if (type === 'book') {
            content = `Truyện "${item.name}" sẽ được xoá khỏi  thư viện`
        }

        if (type === 'noti') {
            content = `Thông báo "${item.title}" sẽ được xoá`
        }


        Alert.alert(
            title,
            content,
            [
                { text: "Xoá", onPress: () => type === 'book' ? this.deleteBook() : type === 'noti' ? deleteNotification(item) : null },
                {
                    text: "Huỷ",
                    style: "cancel"
                }
            ],
            { cancelable: false }
        )
    }


    render() {
        return (
            <TouchableOpacity
                onPress={() => this.deleteConfirm()}
                style={{
                    position: 'absolute',
                    right: 0
                }}
            >
                <Feather
                    name='x'
                    size={16}
                    color={'rgba(0,0,0,0.54)'}
                />
            </TouchableOpacity>
        )
    }
}