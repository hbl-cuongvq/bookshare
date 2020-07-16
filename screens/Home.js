import React, { Component } from 'react'
import {
    Image,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    StatusBar,
    Text
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

//COntext
import { ReadBookContext } from '../contexts/ReadBook'

import SearchTab from '../components/SearchTab'
import BestBook from '../components/BestBook'
import Category from '../components/Category'

import { getNavigation } from '../components/Navigation'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            refreshing: false,
            colorRgba: 0
        }

        getNavigation(this.props.navigation)
        this.setRefreshing = this.setRefreshing.bind(this)
    }

    setRefreshing = (refreshing) => {
        this.setState({
            refreshing: refreshing
        })
    }

    wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    render() {
        const {colorRgba} = this.state
        return (
            <View>
                <StatusBar hidden={true} />

                {/* BACKGROUND */}
                <LinearGradient
                    colors={['#F6B6B6', '#F2645F', '#EE1707']}
                    locations={[0, 0.6, 1]}
                    style={{
                        height: heightScreen,
                        width: widthScreen,
                        position: 'absolute'
                    }}
                >
                    <Text></Text>
                </LinearGradient>

                <View style={{
                    position: 'absolute',
                    elevation: 10,
                    width: 593,
                    height: 578,
                    backgroundColor: '#EC3E61',
                    borderRadius: 593,
                    top: -320,
                    left: -208
                }}></View>

                <View style={{
                    backgroundColor: 'white',
                    width: 593,
                    height: 578,
                    position: 'absolute',
                    top: -370,
                    left: -189,
                    borderRadius: 593,
                    elevation: 10
                }}></View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        elevation: 10000
                    }}
                >
                    <View
                        style={{
                            padding: 16,
                            paddingBottom: 0,
                        }}

                    >
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 8,
                        }}>

                            <Image
                                style={{
                                    width: 48,
                                    height: 48,
                                }}
                                source={require('../assets/logo.png')}
                            />
                            <SearchTab
                                keyword="!"
                                type="icon"
                                navigation={this.props.navigation}
                            />
                        </View>

                        <ReadBookContext.Consumer>
                            {
                                ({ bestBook }) => {
                                    return bestBook &&
                                        <BestBook bestBook={bestBook} {...this.props} />
                                }
                            }
                        </ReadBookContext.Consumer>

                        <View style={{ marginBottom: 20 }}></View>
                        <ReadBookContext.Consumer>
                            {({ categories }) => {
                                return categories && <Category categories={categories} {...this.props} />
                            }}
                        </ReadBookContext.Consumer>

                    </View>

                </ScrollView>

            </View >
        )
    }
}

const styles = StyleSheet.create({
    circleLarge: {
        width: 575 / 360 * widthScreen,
        height: 624 / 360 * widthScreen,
        backgroundColor: 'white',
        borderRadius: 575 / 360 * widthScreen,
        position: 'absolute',
        top: -136 / 360 * widthScreen,
        left: -261 / 360 * widthScreen
    },
    circleLargest: {
        width: 640 / 360 * widthScreen,
        height: 660 / 360 * widthScreen,
        backgroundColor: '#F8ACA6',
        borderRadius: 660 / 360 * widthScreen,
        position: 'absolute',
        top: -158 / 360 * widthScreen,
        left: -221 / 360 * widthScreen
    },
    circleSmall: {
        width: 217 / 360 * widthScreen,
        height: 352 / 360 * widthScreen,
        backgroundColor: 'white',
        borderRadius: 352 / 360 * widthScreen,
        position: 'absolute',
        top: 464 / 360 * widthScreen,
        left: 240 / 360 * widthScreen
    }
})