import React, { Component } from 'react'
import {  
    View,
    Text
} from 'react-native'

export default class Message extends Component {
    render() {
        return (
            <View style={{ marginTop: 24, marginLeft: 16 }}>
                <Text>Tin nhắn</Text>
            </View>
        )
    }
}