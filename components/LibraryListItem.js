import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native'

import BookInfo from '../screens/BookInfo'

import DeleteItem from './DeleteItem'

import SearchTab from './SearchTab'

import {timeFromNow} from '../dateFormat'

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

export default class LibraryListbook extends Component {

    render() {
        const { book, bookId } = this.props
        const { props } = this
        return (
            <View style={{
                flexDirection: 'row',
                marginTop: (this.props.index === 0) ? 26 : 0,
                marginBottom: 26,
                flex: 1,
                marginRight: 16,
                borderRadius: 20,
                padding: 8,
                elevation: 7,
                backgroundColor: 'white',
                marginLeft: 16,
            }}>
                <BookInfo
                    touchType="bookImageLibrary"
                    bookInfo={book}
                    bookId={bookId}
                    {...props}
                />

                <View style={{
                    flex: 1,
                    paddingLeft: 8,
                    justifyContent: 'space-between'
                }}>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1
                        }}>
                            <BookInfo
                                touchType="titleBookLibrary"
                                bookInfo={book}
                                bookId={bookId}
                                {...this.props}
                            />

                            <DeleteItem
                                item={book}
                                bookId={bookId}
                                type="book"
                                screen='reading'
                            />
                        </View>


                        {
                            book.author &&
                            <TouchableOpacity>
                                <Text style={{
                                    fontSize: 14,
                                    color: 'rgba(0, 0, 0, 0.54)'
                                }}>Tác giả: {book.author}</Text>
                            </TouchableOpacity>
                        }

                        <Text style={{
                            color: 'rgba(0,0,0,0.32)',
                            fontSize: 12
                        }}>Cập nhật {timeFromNow(book.lastEdited.seconds)}</Text>
                    </View>
                    <View>
                        {
                            book.tags &&
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={book.tags}
                                renderItem={({ item }) =>
                                    <SearchTab
                                        key={item}
                                        keyword={`#${item}`}
                                        type="tagButton"
                                        tag={item}
                                        color={colors[parseInt(Math.random() * 10)]}
                                        {...props}
                                    />}
                                keyExtractor={(item) => item}
                                style={{ width: 216 / 360 * widthScreen }}
                            />
                        }
                    </View>
                </View>
            </View>
        )
    }
}