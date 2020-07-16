import React, { Component } from 'react'

import {
    TouchableOpacity
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

import News from './notifications/News'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class Notification extends Component {

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
            <Tab.Screen name="Thông báo" component={News} />
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
                <Stack.Screen name='Các cập nhật' component={this.Tabs} />
            </Stack.Navigator>
        )
    }
}