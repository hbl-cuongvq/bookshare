import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import { Dialog } from 'react-native-simple-dialogs'

import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'

export default class BookOptions extends Component {
    render() {
        const {
            visible,
            onTouchOutside,
            book
        } = this.props

        return (
            <Dialog
                visible={visible}
                title=""
                onTouchOutside={onTouchOutside}
            >
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                        <Image
                            style={{ width: 85, height: 119 }}
                            source={book && { uri: book.data.imageUrl }}
                        />

                        <View style={{ marginLeft: 8 }}>
                            <Text style={{ fontSize: 20, color: 'rgba(0,0,0,0.87)', marginBottom: 8 }}>{book && book.data.name}</Text>
                            <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.57)' }}>{book && book.data.author}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.option}>
                        <AntDesign
                            name='infocirlceo'
                            size={20}
                            color='rgba(0,0,0,0.57)'
                        />
                        <Text style={styles.optionText}>Xem thông tin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Entypo
                            name='add-to-list'
                            size={20}
                            color='rgba(0,0,0,0.57)'
                        />
                        <Text style={styles.optionText}>Thêm vào danh sách đọc</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <AntDesign
                            name='addfolder'
                            size={20}
                            color='rgba(0,0,0,0.57)'
                        />
                        <Text style={styles.optionText}>Thêm vào kho lưu trữ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onTouchOutside}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        <Text style={{ fontSize: 16, color: 'rgb(0, 153, 153)', marginTop: 16 }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Dialog>
        )
    }
}

const styles = StyleSheet.create({
    option: {
        marginBottom: 6,
        paddingBottom: 6,
        flexDirection: 'row'
    },
    optionText: {
        marginLeft: 8,
        fontSize: 14,
        color: 'rgba(0,0,0,0.57)'
    }
})