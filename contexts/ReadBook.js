import React, { Component } from 'react'

// API
import { getBookWithCategory } from '../api/book/getBookToRead'
import { getCategories } from '../api/book/getCategories'
import { getChapterToRead } from '../api/book/getChapterToRead'
import { getBestBook } from '../api/book/getBestBook'
import { addLike, addSeen, deleteLike } from '../api/book/bookStatus'
import { addReadBook, addStoreBook } from '../api/user/addReadBookLibrary'
import { addLikesChapter, addReadsChapter, deleteLikesChapter } from '../api/book/chapterStatus'
import { checkBookExist } from '../api/book/checkBookExist'

import Toast from 'react-native-simple-toast'

export const ReadBookContext = React.createContext()

export class ReadBookProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bestBook: null,
            categories: [],
            readBook: [],
            readBookId: null,
            chapters: [],
            currentReadChapter: null,
            currentReadChapterId: null
        }

        this.categories = []

        this.setReadBookId = this.setReadBookId.bind(this)
        this.setBookToCategory = this.setBookToCategory.bind(this)
        this.setChapters = this.setChapters.bind(this)
        this.setBestBook = this.setBestBook.bind(this)
        this.setCurrentReadChapter = this.setCurrentReadChapter.bind(this)
        this.setReadBook = this.setReadBook.bind(this)
        this.setCurrentReadChapterId = this.setCurrentReadChapterId.bind(this)
    }

    setCurrentReadChapterId = (chapterId) => {
        this.setState({
            currentReadChapterId: chapterId
        })
    }

    setReadBook = (book) => {
        this.setState({
            readBook: book
        })
    }

    setCurrentReadChapter = (chapter) => {
        this.setState({
            currentReadChapter: chapter
        })
    }

    setBestBook = bestBook => {
        this.setState({ bestBook })
    }

    setReadBookId = (bookId) => {
        this.setState({
            readBookId: bookId
        })
    }

    setChapters = (chapters) => {
        this.setState({
            chapters: chapters
        })
    }

    getChaptersToRead = async (bookId) => {
        try {
            await getChapterToRead(bookId, this.setChapters)
        } catch (err) {
            alert(err)
        }
    }

    setBookToCategory = (category, books) => {
        let data = {
            title: category,
            books: books
        }

        let index = this.state.categories.findIndex(cate => cate.title === category)

        if (index > -1) {
            let categories = this.state.categories
            categories.splice(index, 1, data)
            this.setState({
                categories: [...categories]
            })
        } else {
            this.setState({
                categories: [...this.state.categories.filter(cate => cate.title !== category), data]
            })
        }
    }

    async componentDidMount() {
        try {

            this.categories = await getCategories()

            this.categories.forEach(async cate => {
                await getBookWithCategory(cate.value, this.setBookToCategory)
            })
            await getBestBook(this.setBestBook)
        } catch (err) {
            Toast.show(err)
        }
    }

    render() {
        return (
            <ReadBookContext.Provider
                value={{
                    categories: this.state.categories,
                    readBookId: this.state.readBookId,
                    setReadBookId: this.setReadBookId,
                    getChaptersToRead: this.getChaptersToRead,
                    chapters: this.state.chapters,
                    currentReadChapter: this.state.currentReadChapter,
                    setCurrentReadChapter: this.setCurrentReadChapter,
                    setChapters: this.setChapters,
                    addLike: addLike,
                    addSeen: addSeen,
                    deleteLike: deleteLike,
                    addReadBook: addReadBook,
                    addStoreBook: addStoreBook,
                    bestBook: this.state.bestBook,
                    readBook: this.state.readBook,
                    setReadBook: this.setReadBook,
                    addLikesChapter: addLikesChapter,
                    addReadsChapter: addReadsChapter,
                    deleteLikesChapter: deleteLikesChapter,
                    currentReadChapterId: this.state.currentReadChapterId,
                    setCurrentReadChapterId: this.setCurrentReadChapterId,
                    checkBookExist: checkBookExist
                }}
            >
                {this.props.children}
            </ReadBookContext.Provider>
        )
    }
}