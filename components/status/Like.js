import React, { Component } from 'react';
import {
    Image,
    Text,
    View
} from 'react-native'

import AntDesign from 'react-native-vector-icons/AntDesign'

export default class Like extends Component {
    render() {
        const {index, hasLike} = this.props
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}>
                <AntDesign
                    name='star'
                    size={21}
                    color={hasLike ? 'orange' : 'rgba(0,0,0,0.32)'}
                    style={{
                        marginRight: 7
                    }}
                />

                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.57)'}}>{index} Lượt thích</Text>
            </View>
        )
    }
}