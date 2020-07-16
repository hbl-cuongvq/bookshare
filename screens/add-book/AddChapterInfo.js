import React, { Component, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native'

import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

import { dateFormat, timeFromNow } from '../../dateFormat'

import { Video } from 'expo-av'

import { AddBookContext } from '../../contexts/AddBook'
import { AddChapterContext } from '../../contexts/AddChapter'

import { Input } from 'react-native-elements'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Modal from 'react-native-modal'

import AwesomeButton from 'react-native-really-awesome-button'
import Foundation from 'react-native-vector-icons/Foundation'
import Feather from 'react-native-vector-icons/Feather'

import { getBookChapter } from '../../api/book/getBookChapter'
import Toast from 'react-native-simple-toast'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

export default class AddChapterInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
            refreshList: null
        }

        this.getChapters = this.getChapters.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.setRefreshList = this.setRefreshList.bind(this)
    }

    getChapters = (chapters) => {
        this.setState({
            list: chapters
        })
    }

    setRefreshList = (refresh) => {
        this.setState({
            refreshList: refresh
        })
    }

    async componentDidMount() {
        const { bookId } = this.props

        this.setRefreshList(true)
        await getBookChapter(bookId, this.getChapters)
        this.setRefreshList(false)
    }

    onRefresh = async () => {
        const { bookId } = this.props

        await getBookChapter(bookId, this.getChapters)

        this.setState({
            refreshList: false
        })
    }

    render() {
        return (
            <View
                style={styles.container}
            >
                <AddChapterComponentButton />
                {
                    this.state.list.length === 0
                        ?
                        <Text style={{
                            color: 'rgba(0,0,0,0.54)',
                            alignSelf: 'center'
                        }}>Chưa có chương truyện!</Text>
                        :
                        <FlatList
                            refreshing={this.state.refreshList}
                            onRefresh={this.onRefresh}
                            data={this.state.list}
                            keyExtractor={(item) => `${item.id}`}
                            renderItem={({ item }) =>
                                ChapterComponent(item)
                            }
                        />
                }

            </View>
        )
    }
}

const ChapterComponent = (item) => (
    <AddChapterContext.Consumer>
        {({ visible, setVisible, setCurrentChapter, setImageUrl, setAudioUrl, setAudioName, setName, setContent }) => (
            <TouchableOpacity
                style={styles.itemWrapper}
                onPress={() => {
                    setCurrentChapter(item)
                    setImageUrl(item.data.imageUrl)
                    setVisible(!visible)
                    if (item.data.audioUrl) {
                        setAudioUrl(item.data.audioUrl)
                        setAudioName(item.data.audioUrl.split('%2F').reverse()[0].split('?')[0].split('%20').join(' '))
                    }
                    setName(item.data.name)
                    setContent(item.data.content)
                }}
            >

                <Image
                    style={{
                        width: 110 / 360 * widthScreen,
                        height: 50 / 640 * heightScreen,
                        marginRight: 8
                    }}
                    source={{ uri: `${item.data.imageUrl ? item.data.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                />

                <View>
                    <Text style={styles.itemTitle}>{item.data.name}</Text>
                    <Text style={{
                        color: 'rgba(0,0,0,0.54)'
                    }}>Ngày tạo: {item.data.created && dateFormat(item.data.created.seconds)}</Text>
                    <Text style={{
                        color: 'rgba(0,0,0,0.54)'
                    }}>Chỉnh sửa lần cuối: {item.data.lastEdited && timeFromNow(item.data.lastEdited.seconds)}</Text>
                </View>
            </TouchableOpacity>
        )}
    </AddChapterContext.Consumer>
)

const AddChapterComponentButton = () => {
    return (
        <AddChapterContext.Consumer>
            {({ isCreating, visible, setVisible, setDefault }) =>
                isCreating ?
                    <AwesomeButton
                        backgroundColor={'rgba(244, 67, 54, 1)'}
                        width={56}
                        height={56}
                        borderRadius={26}
                        style={{
                            position: 'absolute',
                            top: 505 / 640 * heightScreen,
                            left: 280 / 360 * widthScreen
                        }}
                        onPress={() => Toast.show('Is processing...')}
                    >
                        <ActivityIndicator size='large' color='white'></ActivityIndicator>
                        <ChapterChangeInfoComponent />
                    </AwesomeButton>
                    :
                    <AwesomeButton
                        backgroundColor={'rgba(244, 67, 54, 1)'}
                        width={56}
                        height={56}
                        borderRadius={26}
                        style={{
                            position: 'absolute',
                            top: heightScreen > 640 ? 525 / 640 * heightScreen : 505 / 640 * heightScreen,
                            left: widthScreen > 360 ? 305 / 360 * widthScreen : 280 / 360 * widthScreen
                        }}
                        onPress={() => { setVisible(!visible); setDefault() }}
                    >
                        <Foundation name='page-add' size={38} color='white' />
                        <ChapterChangeInfoComponent />
                    </AwesomeButton>
            }
        </AddChapterContext.Consumer>
    )
}

const ChapterChangeInfoComponent = (props) => {
    const videoRef = React.createRef()

    return (
        <AddChapterContext.Consumer>
            {
                ({
                    pickImageHandler,
                    imageUrl,
                    pickAudioHandler,
                    audioUrl,
                    audioPlay,
                    setAudioPlay,
                    audioName,
                    setAudioStop,
                    name,
                    setName,
                    content,
                    setContent,
                    saveChapter,
                    cancelAudio,
                    visible,
                    setVisible,
                    currentChapter,
                    deleteChapter
                }) =>
                    <Modal
                        isVisible={visible}
                        backdropOpacity={0}
                        style={{
                            backgroundColor: 'white',
                            width: widthScreen,
                            height: heightScreen,
                            margin: 0,
                        }}
                        onBackButtonPress={() => { setAudioStop(); setVisible(!visible); }}
                    >
                        <View style={{ flex: 1, padding: 8, paddingTop: 16, paddingBottom: 32 }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{
                                    marginBottom: 16
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingLeft: 8,
                                        paddingRight: 8,
                                        marginBottom: 24
                                    }}
                                >
                                    {/* GO BACK ARROW ICON*/}
                                    <Ionicons
                                        name='md-arrow-back'
                                        size={24}
                                        color='rgba(0,0,0,0.87)'
                                        onPress={() => setVisible(!visible)}
                                    />

                                    {/* DELETE BUTTON */}
                                    {
                                        currentChapter &&
                                        <AddBookContext.Consumer>
                                            {({ selectedBookId }) => (
                                                <AwesomeButton
                                                    backgroundColor='rgba(244, 67, 54, 1)'
                                                    height={36}
                                                    width={84}
                                                    style={{
                                                        padding: 8
                                                    }}
                                                    progress={true}
                                                    onPress={async (next) => {
                                                        await deleteAlert(currentChapter.id, selectedBookId, currentChapter.data.name, deleteChapter)
                                                        next()
                                                        setVisible(!visible)
                                                    }}
                                                >
                                                    <Text style={{ color: 'white' }}>Xoá chương</Text>
                                                </AwesomeButton>
                                            )}
                                        </AddBookContext.Consumer>

                                    }
                                </View>



                                {/* IMAGE PICKER */}
                                <View
                                    style={{
                                        marginBottom: 32,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    {
                                        imageUrl ?
                                            <TouchableOpacity
                                                onPress={() => { setAudioStop(); pickImageHandler() }}
                                            >
                                                <Image
                                                    style={{
                                                        width: 330 / 360 * widthScreen,
                                                        height: 150 / 360 * widthScreen
                                                    }}
                                                    source={{ uri: imageUrl }}
                                                />
                                                <Text style={{ alignSelf: 'center', color: 'rgba(0,0,0,0.54)' }}>Nhấp vào ảnh để thay đổi!</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => { setAudioStop(); pickImageHandler() }}
                                                style={{
                                                    width: 330 / 360 * widthScreen,
                                                    height: 150 / 360 * widthScreen,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <FontAwesome5
                                                    name={'image'}
                                                    size={36}
                                                    color='rgba(0,0,0,0.54)'
                                                />
                                                <Text style={{ color: 'rgba(0,0,0,0.54)' }}>Nhấp vào để thêm ảnh</Text>
                                            </TouchableOpacity>
                                    }
                                </View>

                                {/* AUDIO PICKER */}
                                {
                                    audioUrl ?
                                        <View
                                            style={{
                                                marginBottom: 34,
                                                marginLeft: 8,
                                                marginRight: 8
                                            }}
                                        >
                                            {/* AUDIO COMPONENT */}
                                            <View
                                                style={{
                                                    backgroundColor: '#00264d',
                                                    padding: 8,
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    borderRadius: 64,
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    height: 56
                                                }}
                                            >
                                                <View
                                                    style={{ flex: 14 }}
                                                >
                                                    {/* NAME SONG */}
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            alignSelf: 'center',
                                                            marginBottom: 4,
                                                            overflow: 'hidden'
                                                        }}

                                                    >{audioName}</Text>
                                                    <Video
                                                        ref={videoRef}
                                                        source={{ uri: audioUrl }}
                                                        rate={1.0}
                                                        volume={1.0}
                                                        isMuted={false}
                                                        resizeMode="stretch"
                                                        shouldPlay={false}
                                                    />



                                                </View>
                                                <View style={{ flex: 2, marginRight: 8 }}>
                                                    {
                                                        audioPlay ?
                                                            <FontAwesome5
                                                                name='pause'
                                                                size={24}
                                                                color='white'
                                                                style={{
                                                                    alignSelf: 'center'
                                                                }}
                                                                onPress={() => { setAudioStop(); videoRef.current.pauseAsync() }}
                                                            />
                                                            :
                                                            <FontAwesome5
                                                                name='play'
                                                                size={24}
                                                                color='white'
                                                                style={{
                                                                    alignSelf: 'center'
                                                                }}
                                                                onPress={() => { setAudioPlay(); videoRef.current.playAsync() }}
                                                            />
                                                    }
                                                </View>
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: 'red',
                                                        padding: 2,
                                                        borderRadius: 16,
                                                        width: 20,
                                                        height: 20,
                                                        flex: 1
                                                    }}

                                                    onPress={cancelAudio}
                                                >
                                                    <Feather
                                                        name={'x'}
                                                        color='white'
                                                        size={16}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => { setAudioStop(); pickAudioHandler() }}
                                            >
                                                <Text style={{ color: 'rgba(0,0,0,0.54)', alignSelf: 'center', marginTop: 8 }}>Nhấp để thay đổi audio!</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity
                                            onPress={() => { setAudioStop(); pickAudioHandler() }}
                                            style={{
                                                marginBottom: 34
                                            }}
                                        >
                                            <Text style={{ color: 'rgba(0,0,0,0.54)', alignSelf: 'center', marginTop: 8 }}>Nhấp để chọn audio</Text>
                                        </TouchableOpacity>
                                }

                                {/* INPUT CHAPTER */}
                                <Input
                                    label='Tiêu đề chương'
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                />

                                {/* INPUT CONTENT */}
                                <Input
                                    label='Nội dung chương'
                                    value={content}
                                    onChangeText={(text) => setContent(text)}
                                    multiline={true}
                                />

                                <TouchableOpacity
                                    onPress={async () => {
                                        try {
                                            let result = await DocumentPicker.getDocumentAsync({
                                                type: '*/*'
                                            })

                                            if (result.type === 'success') {
                                                let splits = result.name.split('.')
                                                if (['txt'].includes(splits[splits.length - 1].toLocaleLowerCase())) {
                                                    let string = await FileSystem.readAsStringAsync(result.uri)
                                                    setContent(string)
                                                } else {
                                                    throw 'File không hợp lệ!'
                                                }
                                            }
                                        }
                                        catch (err) {
                                            Toast.show(err)
                                        }
                                    }}

                                >
                                    <Text style={{
                                        color: 'rgba(0,0,0,0.54)',
                                        textAlign: 'center'
                                    }}>Thêm nội dung từ file (.txt)</Text>
                                </TouchableOpacity>


                            </ScrollView>

                            {/* SAVE BUTTON */}
                            <AddBookContext.Consumer>
                                {({ selectedBookId }) => (
                                    <AddChapterContext.Consumer>
                                        {({ setIsCreating, setDefault }) => (
                                            <View
                                                style={{
                                                    marginLeft: 8,
                                                    marginRight: 8
                                                }}
                                            >
                                                <AwesomeButton
                                                    stretch={true}
                                                    onPress={saveChapter}
                                                    backgroundColor={'rgba(244, 67, 54, 1)'}
                                                    progress={true}
                                                    onPress={async (next) => {
                                                        setVisible(false)
                                                        await setIsCreating(true)
                                                        let isSaved = await saveChapter(selectedBookId)
                                                        if (isSaved) {
                                                            await setIsCreating(false)
                                                            next()
                                                            setDefault()
                                                        } else {
                                                            next()
                                                        }
                                                    }}
                                                >
                                                    <Text style={{ color: 'white' }}>{currentChapter ? 'CẬP NHẬT CHƯƠNG' : 'LƯU CHƯƠNG'}</Text>
                                                </AwesomeButton>
                                            </View>
                                        )}
                                    </AddChapterContext.Consumer>
                                )}
                            </AddBookContext.Consumer>
                        </View>
                    </Modal>
            }
        </AddChapterContext.Consumer>
    )
}


const deleteAlert = (chapterId, bookId, chapterName, deleteFuntion) =>
    Alert.alert(
        `${chapterName}`,
        `Bạn có chắc chắn muốn xoá?`,
        [
            {
                text: "Huỷ",
                onPress: () => null,
                style: "cancel"
            },
            { text: "Xác nhận", onPress: () => deleteFuntion(chapterId, bookId) }
        ],
        { cancelable: false }
    )

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 24,
        backgroundColor: 'white',
        flex: 1,
    },
    itemWrapper: {
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTitle: {
        fontSize: 20,
        letterSpacing: 1.2
    },
    itemTimeUpload: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)'
    }
})