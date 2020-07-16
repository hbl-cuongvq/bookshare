import React, { Component } from 'react'

import { auth } from '../api/DBConfig'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import Toast from 'react-native-simple-toast'
import { createChapter } from '../api/book/createChapter'
import { updateChapter } from '../api/book/updateChapter'
import { deleteChapter } from '../api/book/deleteChapter'

export const AddChapterContext = React.createContext()

export class AddChapterProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            image: null,
            imageUrl: null,
            audio: null,
            audioUrl: null,
            audioPlay: false,
            audioName: '',
            name: '', // chapter
            content: '', // chapter,
            isCreating: null,
            visible: false,
            currentChapter: null,
        }

        this.pickImageHandler = this.pickImageHandler.bind(this)
        this.pickAudioHandler = this.pickAudioHandler.bind(this)
        this.setAudioPlay = this.setAudioPlay.bind(this)
        this.setAudioStop = this.setAudioStop.bind(this)
        this.setName = this.setName.bind(this)
        this.setContent = this.setContent.bind(this)
        this.saveChapter = this.saveChapter.bind(this)
        this.cancelAudio = this.cancelAudio.bind(this)
        this.setIsCreating = this.setIsCreating.bind(this)
        this.setDefault = this.setDefault.bind(this)
        this.setVisible = this.setVisible.bind(this)
        this.setCurrentChapter = this.setCurrentChapter.bind(this)
        this.setImageUrl = this.setImageUrl.bind(this)
        this.setAudioUrl = this.setAudioUrl.bind(this)
        this.setAudioName = this.setAudioName.bind(this)
        this.deleteChapter = this.deleteChapter.bind(this)
    }

    setAudioName = (name) => {
        this.setState({
            audioName: name
        })
    }

    setAudioUrl = (url) => {
        this.setState({
            audioUrl: url
        })
    }

    setImageUrl = (url) => {
        this.setState({
            imageUrl: url
        })
    }

    setCurrentChapter = (chapter) => {
        this.setState({
            currentChapter: chapter
        })
    }

    setVisible = (visible) => {
        this.setState({
            visible: visible
        })
    }

    setDefault = () => {
        this.cancelAudio(),
            this.setName('')
        this.setContent('')
        this.setState({
            image: null,
            imageUrl: null,
            isCreating: false
        })
        this.setCurrentChapter(null)
    }

    cancelAudio = () => {
        this.setState({
            audioUrl: null,
            audioPlay: false,
            audioName: '',
            audio: null
        })
    }

    setName = (text) => {
        this.setState({
            name: text
        })
    }

    setContent = (text) => {
        this.setState({
            content: text
        })
    }

    setIsCreating = (isCreating) => {
        this.setState({
            isCreating: isCreating
        })
    }

    setAudioPlay = () => {
        this.setState({
            audioPlay: true
        })
    }

    setAudioStop = () => {
        this.setState({
            audioPlay: false
        })
    }

    pickImageHandler = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [11, 5],
                quality: 1,
            })

            if (result) {
                this.setState({
                    image: result,
                    imageUrl: result.uri
                })
            } else {
                this.setState({
                    image: null
                })
            }

        } catch (E) {
            this.setState({
                image: null,
                imageUrl: null
            })
            Toast.show(E)
            return null
        }
    }

    pickAudioHandler = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: 'audio/mpeg'
            })

            if (result.type === 'success') {
                this.setState({
                    audio: result,
                    audioUrl: result.uri,
                    audioName: result.name.split('.')[0]
                })
            }
        } catch (err) {
            Toast.show(E)
            return null
        }
    }

    deleteChapter = async (chapterId, bookId) => {
        try {
            let deleted = deleteChapter(chapterId, bookId)
            if (deleted) Toast.show('Chapter deleted!')
        } catch (err) {
            Toast.show(err)
        }

    }

    saveChapter = async (bookId) => {
        const {
            name,
            content,
            imageUrl,
            audioUrl,
            audio,
            image,
            currentChapter
        } = this.state

        try {
            let result = null
            const { uid } = auth.currentUser
            if (currentChapter) {
                result = await updateChapter(name, content, image, imageUrl, audio, audioUrl, bookId, currentChapter)
                if (result) Toast.show('Updated chapter!')
            } else {
                result = await createChapter(name, content, image, audio, bookId, uid)
                if (result) Toast.show('Created chapter!')
            }


            this.setIsCreating(false)
            this.setDefault()
        } catch (err) {
            Toast.show(err)
            return false
        }
    }

    render() {
        return (
            <AddChapterContext.Provider
                value={{
                    image: this.state.image,
                    imageUrl: this.state.imageUrl,
                    audioUrl: this.state.audioUrl,
                    audioName: this.state.audioName,
                    audioPlay: this.state.audioPlay,
                    setAudioPlay: this.setAudioPlay,
                    setAudioStop: this.setAudioStop,
                    name: this.state.name,
                    setName: this.setName,
                    content: this.state.content,
                    setContent: this.setContent,
                    pickImageHandler: this.pickImageHandler,
                    pickAudioHandler: this.pickAudioHandler,
                    cancelAudio: this.cancelAudio,
                    saveChapter: this.saveChapter,
                    isCreating: this.state.isCreating,
                    setIsCreating: this.setIsCreating,
                    setDefault: this.setDefault,
                    setVisible: this.setVisible,
                    visible: this.state.visible,
                    currentChapter: this.state.currentChapter,
                    setCurrentChapter: this.setCurrentChapter,
                    setImageUrl: this.setImageUrl,
                    setAudioUrl: this.setAudioUrl,
                    setAudioName: this.setAudioName,
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
                    deleteChapter: this.deleteChapter
                }}
            >
                {this.props.children}
            </AddChapterContext.Provider>
        )
    }
}