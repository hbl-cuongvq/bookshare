import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    Dimensions,
    View
} from 'react-native'

import DeleteItem from './DeleteItem'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

export default class NotificationListItem extends Component {
    render() {
        const { item, deleteNotification } = this.props

        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 16 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <DeleteItem
                        item={item}
                        type="noti"
                        deleteNotification={deleteNotification}
                    />
                </View>


                <Text style={styles.content}>{item.content}</Text>

                <Text style={styles.time}>{item.time}</Text>

                <View style={styles.line}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: 'rgba(244, 67, 54, 1)',
        marginBottom: 8
    },
    content: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.57)',
        marginBottom: 8
    },
    time: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.42)',
        marginBottom: 8,
    },
    line: {
        width: widthScreen - 32,
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.32)',
        marginBottom: 16
    }
})