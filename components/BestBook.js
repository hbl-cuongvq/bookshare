import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator
} from 'react-native'

import SearchTab from './SearchTab'

import BookInfo from '../screens/BookInfo'
import { color } from 'react-native-reanimated'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

colors = [
    'midnightblue',
    'hotpink',
    'limegreen',
    'violet',
    'tomato',
    'gold',
    'dimgray',
    'purple',
    'teal',
    'steelblue'
]

export default class BestBook extends Component {

    render() {
        const { bestBook } = this.props

        return (
            <View>
                <Text style={styles.title}>Xem nhiều nhất</Text>
                {
                    bestBook ?
                        <View style={styles.cardWrapper}>
                            <BookInfo
                                touchType="titleBook"
                                bookInfo={bestBook.data}
                                bookId={bestBook.id}
                                {...this.props}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View>

                                    <View
                                        style={{flexDirection: 'row'}}
                                    >
                                        <Text style={styles.author}>Tác giả: </Text>
                                        <Text style={[styles.author, {fontWeight: 'bold'}]}>{`${bestBook.data.author}`}</Text>
                                    </View>

                                    <Text style={styles.description}>{`${bestBook.data.description}`}</Text>
                                </View>

                                <BookInfo
                                    touchType="bestBookImage"
                                    bookInfo={bestBook.data}
                                    bookId={bestBook.id}
                                    {...this.props}
                                />
                            </View>

                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginTop: 16, flex: 1 }}
                            >
                                {
                                    bestBook.data.tags && bestBook.data.tags.map((tag, index) => (
                                        <SearchTab
                                            key={index}
                                            keyword={`#${tag}`}
                                            type="tagButton"
                                            tag={tag}
                                            {...this.props}
                                            color={colors[parseInt(Math.random() * 10)]}
                                        />
                                    ))
                                }
                            </ScrollView>
                        </View>
                        :
                        <View
                            style={[styles.cardWrapper, {
                                height: 306 / 640 * heightScreen,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]}
                        >
                            <ActivityIndicator size='large' />
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: '#000000DE',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 6,
        letterSpacing: 1.5
    },
    cardWrapper: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 40,
        marginBottom: 32,
        elevation: 10
    },
    author: {
        color: 'rgba(0, 0, 0, 0.64)',
        fontSize: 16
    },
    bookImage: {
        width: 160 / 360 * widthScreen,
        height: 224 / 360 * widthScreen,
    },
    description: {
        width: 134 / 360 * widthScreen,
        height: 204,
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.54)',
        marginTop: 14,
        overflow: 'hidden'
    },
    tagButton: {
        marginTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.24)',
        borderRadius: 20,
        marginRight: 9
    },
    textTagButton: {
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 14,
        paddingRight: 14,
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: 14,
        fontWeight: 'bold'
    }
})
