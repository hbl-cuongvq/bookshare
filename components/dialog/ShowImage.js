import React, { Component } from 'react';

import {
    View,
    Image,
    Text
} from 'react-native'

import { Dialog } from 'react-native-simple-dialogs'

export default class ShowImage extends Component {
    render() {
        const { 
            visible, 
            title, 
            onTouchOutside, 
            widthImage, 
            heightImage, 
            sourceImage 
        } = this.props
        
        return (
            <Dialog
                visible={visible}
                title={title}
                onTouchOutside={onTouchOutside}
            >
                <View>
                    <Image
                        style={{ width: widthImage, height: heightImage }}
                        source={{ uri: sourceImage }}
                    />
                    {
                        this.props.avatar &&
                        <Text style={{
                            textAlign: 'center',
                            color: 'rgba(0,0,0,0.54)',
                            marginTop: 8
                        }}>Ấn giữ để thay đổi</Text>
                    }
                </View>
            </Dialog>
        )
    }
}