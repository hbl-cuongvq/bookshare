import React, { Component } from 'react';
import {
    Image,
    Text,
    View
} from 'react-native'

import AntDesign from 'react-native-vector-icons/AntDesign'

export default class Seen extends Component {
    render() {
        const {index} = this.props
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}>
                <AntDesign
                    name='eye'
                    size={22}
                    color='dodgerblue'
                    style={{
                        marginRight: 7
                    }}
                />

                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.57)'}}>{index} Lượt đọc</Text>
            </View>
        )
    }
}