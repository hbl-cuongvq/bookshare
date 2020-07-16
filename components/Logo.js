import React, { Component } from 'react';
import {
    TouchableOpacity,
    Image
} from 'react-native'

export default function Logo(props) {
    const { width, height } = props

    return (
        <TouchableOpacity
            onPress={() => props.navigation.navigate('Home')}
        >
            <Image
                style={{
                    width: width,
                    height: height,
                    marginLeft: 16
                }}
                source={require('../assets/logo.png')}
            />
        </TouchableOpacity>
    )
}