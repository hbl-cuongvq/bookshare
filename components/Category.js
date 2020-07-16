import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

import SearchBar from './SearchTab'

import BookOptions from './dialog/BookOptions'
import BookInfo from '../screens/BookInfo'


export default class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showBookOptions: false,
            selectbook: null
        }
    }

    onShowBookOptions(book) {
        this.setState({
            showBookOptions: true,
            selectbook: book
        })
    }

    render() {
        const { categories, colorRgba } = this.props
        return (
            <View>
                {
                    categories.map((category) =>
                        category.books.length > 0 &&
                        <View
                            key={category.title}
                            style={styles.container}
                        >
                            <Text style={styles.title}>{category.title}</Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{
                                    width: widthScreen,
                                    marginLeft: -16,
                                    paddingHorizontal: 16
                                }}
                            >
                                {
                                    category.books.map(book =>
                                        <BookInfo
                                            key={book.id}
                                            onShowBookOptions={() => this.onShowBookOptions(book)}
                                            touchType="categoryImage"
                                            bookInfo={book.data}
                                            bookId={book.id}
                                            {...this.props}
                                        />
                                    )
                                }

                                <SearchBar
                                    keyword={`$${category.title}`}
                                    type="categoryMore"
                                    {...this.props}
                                />
                            </ScrollView>
                        </View>
                    )
                }

                <BookOptions
                    visible={this.state.showBookOptions}
                    book={this.state.selectbook && this.state.selectbook}
                    onTouchOutside={() => this.setState({ showBookOptions: false })}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        color: '#000000DE',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 6,
        letterSpacing: 1.5
    },
    image: {
        width: 85,
        height: 119,
        marginRight: 8
    }
})