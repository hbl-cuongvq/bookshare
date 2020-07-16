import React, { Component } from 'react'

import Uploaded from './edit-book/Uploaded'
import Draft from './edit-book/Draft'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

export default class EditBook extends Component {
    render() {
        return (
            <Tab.Navigator
                tabBarOptions={{
                    indicatorStyle: {
                        marginTop: 10,
                        backgroundColor: 'white'
                    },
                    labelStyle: {
                        color: 'white',
                        fontSize: 14,
                        textTransform: 'none'
                    },
                    style: {
                        backgroundColor: 'rgba(244, 67, 54, 1)',
                    }
                }}

                sceneContainerStyle={{
                    backgroundColor: 'white'
                }}
            >
                <Tab.Screen name='Đã đăng' component={Uploaded} />
                <Tab.Screen name='Bản thảo' component={Draft} />
            </Tab.Navigator>
        )
    }
}