import React, { Component } from 'react'

import { auth } from '../api/DBConfig'

import * as ImagePicker from 'expo-image-picker'

import { createBook } from '../api/book/createBook'
import { updateBook } from '../api/book/updateBook'
import { updateAuthor } from '../api/book/updateAuthor'
import { publishBook, unPublishBook } from '../api/book/publishBook'
import {deleteBook} from '../api/book/deleteBook'
import { updateCategoriesAndTags } from '../api/book/updateCategoriesAndTags'


export const AddBookContext = React.createContext()

import Toast from 'react-native-simple-toast'

export class AddBookProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imageUrl: null,
            image: null,
            name: '',
            author: '',
            authorTag: '',
            categories: [],
            selectedCategories: [],
            tags: [],
            categoryText: '',
            tagText: '',
            description: '',
            selectedBook: null,
            selectedBookId: null,
            author: ''
        }

        this.setImageUrl = this.setImageUrl.bind(this)
        this.setName = this.setName.bind(this)
        this.setDescription = this.setDescription.bind(this)
        this.pickImageHandler = this.pickImageHandler.bind(this)
        this.saveBook = this.saveBook.bind(this)
        this.setSelectedBook = this.setSelectedBook.bind(this)
        this.setDefault = this.setDefault.bind(this)
        this.setImage = this.setImage.bind(this)
        this.publishBook = this.publishBook.bind(this)
        this.unPublishBook = this.unPublishBook.bind(this)
        this.addCategory = this.addCategory.bind(this)
        this.addTag = this.addTag.bind(this)
        this.setCategoryText = this.setCategoryText.bind(this)
        this.setTagText = this.setTagText.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
        this.deleteTag = this.deleteTag.bind(this)
        this.setDefaultCategoriesAndTags = this.setDefaultCategoriesAndTags.bind(this)
        this.deleteBook= this.deleteBook.bind(this)
        this.updateCategoriesAndTags = this.updateCategoriesAndTags.bind(this)
        this.setSelectedCategories = this.setSelectedCategories.bind(this)
        this.setTag = this.setTag.bind(this)
        this.setCategories = this.setCategories.bind(this)
        this.setAuthor = this.setAuthor.bind(this)
    }

    setAuthor = (author) => {
        this.setState({
            author: author
        })
    }

    setTag = (tags) => {
        this.setState({
            tags: tags
        })
    } 

    setSelectedCategories=(selectedCategories) => {
        this.setState({
            selectedCategories: selectedCategories
        })
    }

    setCategories=(categories) => {
        this.setState({
            categories: categories
        })
    }

    updateCategoriesAndTags = async (categories, tags) => {
        const { selectedBookId } = this.state
        console.log(selectedBookId)
        try {
            await updateCategoriesAndTags(categories, tags, selectedBookId)
            Toast.show('Updated!')
        } catch(err) {
            Toast.show(err)
        }
    }

    setDefaultCategoriesAndTags = () => {
        const {selectedBookId, selectedBook} = this.state
        console.log(selectedBook)
        if (selectedBookId) {
            this.setState({
                categories: selectedBook.categories ? selectedBook.categories : [],
                tags: selectedBook.tags ? selectedBook.tags : []
            })
        }
    }

    deleteCategory = (category) => {
        let categories = this.state.categories
        this.setState({
            categories: categories.filter(c => c !== category)
        })
    }

    deleteTag = (tag) => {
        let tags = this.state.tags
        this.setState({
            tags: tags.filter(t => t !== tag)
        })
    }

    addCategory = (category) => {
        let categories = this.state.categories
        categories.push(category)
        this.setState({
            categories: categories
        })
    }

    addTag = (tag) => {
        let tags = this.state.tags
        this.setState({
            tags: [...tags, tag]
        })
    }

    setCategoryText = (text) => {
        this.setState({
            categoryText: text
        })
    }

    setTagText = (text) => {
        this.setState({
            tagText: text
        })
    }

    setDefault = () => {
        this.setName('')
        this.setImageUrl('')
        this.setImage(null)
        this.setDescription('')
        this.setSelectedBook(null, null)
    }

    setImage = (image) => {
        this.setState({
            image: image
        })
    }

    setSelectedBook = (id, data) => {
        this.setState({
            selectedBookId: id,
            selectedBook: data
        })
    }

    setImageUrl = (imageSource) => {
        this.setState({
            imageUrl: imageSource
        })
    }

    setName = (text) => {
        this.setState({
            name: text
        })
    }

    setDescription = (text) => {
        this.setState({
            description: text
        })
    }


    pickImageHandler = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [5, 7],
                quality: 1,
            })

            if (!result.cancelled) {
                this.setImageUrl(result.uri)
                this.setState({
                    image: result
                })
            } else {
                this.setState({
                    image: null
                })
            }

        } catch (E) {
            this.setState({
                image: null
            })
            return Toast.show(E)
        }
    }

    deleteBook = async (bookId) => {
        try {
            let deleted = await deleteBook(bookId)
            if (deleted) {
                Toast.show('Book deleted!')
            }
        } catch (err) {
            Toast.show(err)
        }
    }

    saveBook = async () => {
        try {
            // CREATE BOOK INFO IN DATABASE
            const { name, description, imageUrl, image, selectedBook, selectedBookId } = this.state
            const user = auth.currentUser

            let result = null
            if (selectedBookId) {
                result = await updateBook(name, description, image, imageUrl, selectedBookId)
                if (result) Toast.show('Updated book!')
            }
            else {
                result = await createBook(name, description, image, user.uid)
                if (result) {
                    Toast.show('Created book!')
                }
            }

            if (result) {
                result.get().then(doc => {
                    if (doc.exists) {
                        this.setState({
                            selectedBook: doc.data(),
                            selectedBookId: doc.id,
                            imageUrl: doc.data().imageUrl,
                            image: null
                        })
                    } else {
                        throw "No such data!"
                    }
                }).catch(err => { throw err })

                return true
            } else {
                return false
            }

        } catch (err) {
            Toast.show(err)
            return false
        }
    }

    publishBook = async () => {
        const { selectedBookId, tags, categories } = this.state
        try {
            let result = await publishBook(selectedBookId, tags, categories)
            if (result) {
                this.setState({
                    selectedBook: (await result.get()).data(),
                    selectedBookId: (await result.get()).id
                })
            }
        } catch (err) {
            Toast.show(err)
        }
    }

    unPublishBook = async () => {
        const { selectedBookId } = this.state
        try {
            let result = await unPublishBook(selectedBookId)
            if (result) {
                this.setState({
                    selectedBook: (await result.get()).data(),
                    selectedBookId: (await result.get()).id
                })
            }
        } catch (err) {
            Toast.show(err)
        }
    }

    render() {
        return (
            <AddBookContext.Provider
                value={{
                    imageUrl: this.state.imageUrl,
                    setImageUrl: this.setImageUrl,
                    pickImageHandler: this.pickImageHandler,
                    name: this.state.name,
                    setName: this.setName,
                    description: this.state.description,
                    setDescription: this.setDescription,
                    saveBook: this.saveBook,
                    selectedBook: this.state.selectedBook,
                    selectedBookId: this.state.selectedBookId,
                    setSelectedBook: this.setSelectedBook,
                    setDefault: this.setDefault,
                    setImage: this.setImage,
                    publishBook: this.publishBook,
                    unPublishBook: this.unPublishBook,
                    categories: this.state.categories,
                    tags: this.state.tags,
                    addCategory: this.addCategory,
                    addTag: this.addTag,
                    setCategoryText: this.setCategoryText,
                    setTagText: this.setTagText,
                    categoryText: this.state.categoryText,
                    tagText: this.state.tagText,
                    deleteCategory: this.deleteCategory,
                    deleteTag: this.deleteTag,
                    setDefaultCategoriesAndTags: this.setDefaultCategoriesAndTags,
                    deleteBook: this.deleteBook,
                    updateCategoriesAndTags: this.updateCategoriesAndTags,
                    setSelectedCategories: this.setSelectedCategories,
                    setTag: this.setTag,
                    setCategories: this.setCategories,
                    author: this.state.author,
                    setAuthor: this.setAuthor,
                    updateAuthor: updateAuthor
                }}
            >
                {this.props.children}
            </AddBookContext.Provider>
        )
    }
}