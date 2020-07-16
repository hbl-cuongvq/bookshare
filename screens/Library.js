import React, { Component } from 'react'

import {
    TouchableOpacity,
    View
} from 'react-native'

import Logo from '../components/Logo'

import {
    createStackNavigator
} from '@react-navigation/stack'

import {
    createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs'

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()


import Reading from './libraries/Reading'
import Store from './libraries/Store'

import Entypo from 'react-native-vector-icons/Entypo'

export default class Library extends Component {

    Tabs = () => (
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
            <Tab.Screen name="Đọc hiện tại" component={Reading} />
            <Tab.Screen name="Kho lưu trữ" component={Store} />
        </Tab.Navigator>
    )

    render() {
        return (
            <Stack.Navigator
                headerMode='float'
                screenOptions={{
                    headerLeft: () => (
                        <Logo width={38} height={38} {...this.props} />
                    )
                }}
            >
                <Stack.Screen name="Thư viện" component={this.Tabs} />
            </Stack.Navigator>
        )
    }
}