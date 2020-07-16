import React, { Component } from 'react';
import {
    Image,
    Text,
    View
} from 'react-native'

import Entypo from 'react-native-vector-icons/Entypo'

export default class Like extends Component {
    render() {
        const {index} = this.props
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}>
                <Entypo
                    name='list'
                    size={21}
                    color='forestgreen'
                    style={{
                        marginRight: 7
                    }}
                />

                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.57)'}}>{index} Chương</Text>
            </View>
        )
    }
}