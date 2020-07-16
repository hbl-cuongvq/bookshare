import * as ScreenOrientation from 'expo-screen-orientation'
import {
    View,
    Text
} from 'react-native'

import {
    NotificationProvider,
    NotificationContext
} from './contexts/Notification'

import {
    AuthProvider,
    AuthContext
} from './contexts/Auth'
import {
    ReadBookProvider
} from './contexts/ReadBook'

import {
    AddBookProvider
} from './contexts/AddBook'
import {
    AddChapterProvider
} from './contexts/AddChapter'

import 'react-native-gesture-handler'
import React, { Component } from 'react'
import {
    YellowBox,
    Easing
} from 'react-native'

import { auth } from './api/DBConfig'

YellowBox.ignoreWarnings([
    'Setting a timer',
    'Require cycle',
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
    "Can't perform a React state update on an unmounted component.",
    "Deprecated: Native Google Sign-In has been moved to Expo.GoogleSignIn ('expo-google-sign-in') Falling back to `web` behavior. `behavior` deprecated in SDK 34"
])

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 50,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const closeConfig = {
    animation: 'timing',
    config: {
        duration: 200,
        easing: Easing.linear
    }
}

import SignUp from './screens/SignUp'
import SignIn from './screens/SignIn'
import ForgotPassword from './screens/ForgotPassword'

import Home from './screens/Home'
import Library from './screens/Library'
import Notification from './screens/Notification'
import User from './screens/User'
import AddButton from './components/AddButton'
import AddStackComponent from './screens/add-book/AddStackComponent'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import ReadBook from './screens/ReadBook'
import Chapters from './screens/Chapters'

import { NavigationContainer, NavigationContext } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import { navigation } from './components/Navigation'

const Tab = createBottomTabNavigator()

const Stack = createStackNavigator()

export default class App extends Component {
    constructor(props) {
        super(props)

        this.AppTabComponent = this.AppTabComponent.bind(this)
    }

    async componentDidMount() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    }

    EmptyScreen = () => null

    AppTabComponent = () => (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    switch (route.name) {
                        case 'Home':
                            return <Foundation name={'home'} size={28} color={color} />
                            break;
                        case 'Library':
                            return <MaterialIcons name={'library-books'} size={28} color={color} />
                            break;
                        case 'AddButton':
                            return <AddButton navigation={navigation} />
                            break;
                        case 'Notification':
                            return (
                                <NotificationContext.Consumer>
                                    {({ messages }) => (
                                        <View>
                                            {
                                                !focused &&
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        backgroundColor: 'red',
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2,
                                                        borderRadius: 14,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        right: 0,
                                                        top: -4,
                                                        zIndex: 999999
                                                    }}
                                                >
                                                    <Text style={{
                                                        color: 'white',
                                                        fontSize: 10
                                                    }}>{messages.filter(m => m.data.seen === false).length}</Text>
                                                </View>
                                            }
                                            <MaterialIcons name={'notifications-active'} size={28} color={color} />
                                        </View>
                                    )}
                                </NotificationContext.Consumer>
                            )
                            break;
                        case 'User':
                            return <FontAwesome5 name={'user-alt'} size={22} color={color} />
                            break;
                    }
                },
            })}

            tabBarOptions={{
                activeTintColor: 'rgba(244, 67, 54, 1)',
                inactiveTintColor: 'rgba(0, 0, 0, 0.54)',
                showLabel: false,
            }}

        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Library" component={Library} />
            <Tab.Screen name="AddButton" component={this.EmptyScreen} />
            <Tab.Screen name="Notification" component={Notification} />
            <Tab.Screen name="User" component={User} />
        </Tab.Navigator>
    )

    render() {
        return (
            <AuthProvider>
                <ReadBookProvider>
                    <AuthContext.Consumer>
                        {
                            ({ isSignedIn }) =>
                                <NavigationContainer>
                                    {
                                        isSignedIn ? (

                                            <AddBookProvider>
                                                <AddChapterProvider>
                                                    <NotificationProvider>
                                                        <Stack.Navigator
                                                            headerMode="none"
                                                            screenOptions={{
                                                                ...TransitionPresets.SlideFromRightIOS,
                                                                transitionSpec: {
                                                                    open: config,
                                                                    close: closeConfig
                                                                }
                                                            }}
                                                        >
                                                            <Stack.Screen name='tabsScreen' component={this.AppTabComponent} />
                                                            <Stack.Screen name='Chapters' component={Chapters} />
                                                            <Stack.Screen name='ReadBook' component={ReadBook} />
                                                            <Stack.Screen name='AddBook' component={AddStackComponent} />
                                                        </Stack.Navigator>
                                                    </NotificationProvider>
                                                </AddChapterProvider>
                                            </AddBookProvider>
                                        ) :
                                            (
                                                <Stack.Navigator
                                                    headerMode="none"
                                                >
                                                    <Stack.Screen name='SignIn' component={SignIn} />
                                                    <Stack.Screen name='SignUp' component={SignUp} />
                                                    <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
                                                </Stack.Navigator>
                                            )
                                    }
                                </NavigationContainer>
                        }
                    </AuthContext.Consumer>
                </ReadBookProvider>
            </AuthProvider >
        )
    }
}
