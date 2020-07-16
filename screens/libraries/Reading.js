import React, { Component } from 'react'
import {
    View,
    Text,
    FlatList,
    ActivityIndicator
} from 'react-native'

import LibraryListItem from '../../components/LibraryListItem'

import { getReadingBookLibrary } from '../../api/book/getBookLibrary'

import Toast from 'react-native-simple-toast'


export default class Reading extends Component {
    constructor(props) {
        super(props)

        this.state = {
            books: null,
            refreshing: false
        }

        this.setBooks = this.setBooks.bind(this)
        this.getBooks = this.getBooks.bind(this)
        this.setRefreshing = this.setRefreshing.bind(this)
    }

    setRefreshing = refreshing => this.setState({refreshing})

    setBooks = books => {
        this.setState({ books })
    }

    getBooks = async () => {
        this.setRefreshing(true)
        try {
            await getReadingBookLibrary(this.setBooks)
        } catch (err) {
            Toast.show(err)
        }
        this.setRefreshing(false)
    }

    componentDidMount() {
        this.getBooks()
    }

    render() {
        const { books, refreshing } = this.state
        const { props } = this

        return (
            <View style={{ flex: 1 }}>
                {
                    books ?
                        books.length > 0 ?
                            <FlatList
                                data={books}
                                refreshing={refreshing}
                                onRefresh={this.getBooks}
                                renderItem={({ item, index }) => item ? (
                                    <LibraryListItem
                                        book={item.data}
                                        bookId={item.id}
                                        {...props}
                                        index={index}
                                    />
                                ) : null}

                                showsVerticalScrollIndicator={false}

                                keyExtractor={(item, index) => item ? item.id : index.toString()}
                            />
                            :
                            <Text style={{ textAlign: 'center', color: 'rgba(0,0,0,0.54)', marginTop: 24 }}>Thư viện trống</Text>
                        : <ActivityIndicator size='large' style={{ marginTop: 24 }} />
                }
            </View>
        )
    }
}