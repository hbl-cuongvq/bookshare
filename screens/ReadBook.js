import React, { Component } from 'react'

import * as Speech from 'expo-speech'

import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    BackHandler
} from 'react-native'

import { auth } from '../api/DBConfig'

import ShowImage from '../components/dialog/ShowImage'

import { ReadBookContext } from '../contexts/ReadBook'

import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Video } from 'expo-av';
import Toast from 'react-native-simple-toast'


const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height



export default class ReadBook extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dialogImageVisible: false,
            isPlay: true,
            offsetY: 0,
            currentSentence: null,
            isStop: true
        }

        this.scroll = React.createRef()
        this.video = React.createRef()

        this.setIsPlay = this.setIsPlay.bind(this)
        this.handleLike = this.handleLike.bind(this)
        this.goToTop = this.goToTop.bind(this)
        this.onSpeak = this.onSpeak.bind(this)
        this.speakLoop = this.speakLoop.bind(this)
        this.onPlayVideo = this.onPlayVideo.bind(this)
        this.setCurrentSentence = this.setCurrentSentence.bind(this)
    }

    setCurrentSentence = currentSentence => this.setState({ currentSentence })

    onPlayVideo = async () => {
        let status = await this.video.current.getStatusAsync()
        if (status.isPlaying) {
            this.setIsPlay(false)
            await this.video.current.pauseAsync()
        } else {
            this.setIsPlay(true)
            await this.video.current.playAsync()
        }
    }

    speakLoop = (index, textArr) => {
        let sentence = textArr[index]

        Speech.speak(sentence, {
            language: 'vn',
            pitch: 0.9,
            rate: 1,
            onDone: () => {
                if ((index + 1) < textArr.length) {
                    this.speakLoop(index + 1, textArr)
                } else {
                    this.setState({
                        currentSentence: null,
                        isStop: true
                    })
                }
            },
            onStopped: () => {
                this.setState({
                    currentSentence: sentence
                })
            }
        })
    }

    onSpeak = async (text) => {
        let isSpeak = await Speech.isSpeakingAsync()
        if (isSpeak) {
            await Speech.stop()
            this.setState({
                isStop: true
            })
            console.log('speak stop')
        } else {
            this.setState({
                isStop: false
            })
            const { currentSentence } = this.state
            // const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.';
            // const regex = /[^\.,\"\' ]\S+?(?= |\n|\.|,)/g;
            // let found = paragraph.match(regex);
            // found = found.join(' ')

            let textArr = text.split(/[.:;?!]+/)
            if (currentSentence) {
                let index = textArr.findIndex(sentence => sentence === currentSentence)
                if (index > 0) {
                    this.speakLoop(index, textArr)
                } else {
                    this.setCurrentSentence(null)
                    console.log('speak start')
                    this.speakLoop(0, textArr)
                }
            } else {
                console.log('speak start')
                this.speakLoop(0, textArr)
            }
        }
    }

    goToTop = () => {
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    }


    setIsPlay = (isPlay) => {
        this.setState({ isPlay })
    }

    handleLike = async (currentReadChapter) => {
        let value = this.context
        try {

            if (currentReadChapter.data.likes) {
                let hasLike = currentReadChapter.data.likes.includes(auth.currentUser.uid)
                if (hasLike) {
                    value.deleteLikesChapter(value.readBookId, currentReadChapter.id)
                } else {
                    value.addLikesChapter(value.readBookId, currentReadChapter.id)
                }
            } else {
                value.addLikesChapter(value.readBookId, currentReadChapter.id)
            }
            await value.getChaptersToRead(value.readBookId)
        } catch (err) {
            Toast.show(err)
        }
    }

    componentDidMount() {
        let value = this.context
        value.setCurrentReadChapter(value.chapters.find(chapter => chapter.id === value.currentReadChapterId))

        BackHandler.addEventListener('hardwareBackPress', async () => {
            await Speech.stop()
            this.props.navigation.goBack()
        })
    }

    render() {
        let value = this.context
        let { chapters } = value
        let currentReadChapter = chapters.find(chapter => chapter.id === value.currentReadChapterId)
        let index = chapters.findIndex(chapter => chapter.id === currentReadChapter.id)
        let { isStop } = this.state

        return (
            currentReadChapter &&
            <View
                style={{
                    backgroundColor: 'white',
                    flex: 1
                }}
            >
                {
                    this.state.offsetY > 165
                    &&
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            width: 50,
                            height: 50,
                            bottom: 20,
                            borderRadius: 50,
                            right: 20,
                            backgroundColor: 'red',
                            zIndex: 6000,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}

                        onPress={this.goToTop}
                    >
                        <Ionicons
                            name='ios-arrow-up'
                            size={36}
                            color='white'
                        />
                    </TouchableOpacity>
                }

                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    ref={(c) => { this.scroll = c }}
                    onScroll={(event) => {
                        this.setState({
                            offsetY: event.nativeEvent.contentOffset.y
                        })
                    }}
                >

                    {/* NAVIGATION */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: 20,
                        paddingBottom: 20,
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity
                            onPress={async () => {
                                this.setCurrentSentence(null)
                                let isSpeak = await Speech.isSpeakingAsync()
                                if (isSpeak) {
                                    await Speech.stop()
                                    this.setState({
                                        isStop: true
                                    })
                                }
                                if (index == 0) {
                                    this.props.navigation.goBack()
                                } else {
                                    try {
                                        value.setCurrentReadChapterId(chapters[index - 1].id)
                                        value.setCurrentReadChapter(chapters[index - 1])
                                        value.addReadsChapter(value.readBookId, chapters[index - 1].id)
                                    } catch (err) {
                                        Toast.show(err)
                                    }
                                }
                            }}
                        >
                            <Feather
                                name='arrow-left'
                                size={24}
                                color='rgba(0,0,0,0.54)'
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    zIndex: 2000,
                                    right: 96
                                }}

                                onPress={() => {
                                    this.onSpeak(currentReadChapter.data.content)
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={isStop ? 'volume-off' : 'volume-high'}
                                    size={24}
                                    color='rgba(0,0,0,0.54)'
                                />
                            </TouchableOpacity>
                            {
                                currentReadChapter.data.audioUrl &&
                                <View>
                                    <TouchableOpacity
                                        onPress={this.onPlayVideo}
                                        style={{
                                            position: 'absolute',
                                            zIndex: 2000,
                                            top: -12,
                                            right: 24
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name={this.state.isPlay ? 'music' : 'music-off'}
                                            size={24}
                                            color='rgba(0,0,0,0.54)'
                                        />
                                    </TouchableOpacity>
                                    {/* PLAY MUSIC */}
                                    <Video
                                        ref={this.video}
                                        source={{ uri: currentReadChapter.data.audioUrl }}
                                        rate={1.0}
                                        volume={0.1}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{ width: 0, height: 0 }}
                                    />
                                </View>
                            }


                            {
                                index < chapters.length - 1 ?
                                    <TouchableOpacity
                                        onPress={async () => {
                                            this.setCurrentSentence(null)
                                            let isSpeak = await Speech.isSpeakingAsync()
                                            if (isSpeak) {
                                                await Speech.stop()
                                                this.setState({
                                                    isStop: true
                                                })
                                            }
                                            try {
                                                value.setCurrentReadChapterId(chapters[index + 1].id)
                                                value.setCurrentReadChapter(chapters[index + 1])
                                                value.addReadsChapter(value.readBookId, chapters[index + 1].id)
                                            } catch (err) {
                                                Toast.show(err)
                                            }

                                        }}
                                    >
                                        <Feather
                                            name='arrow-right'
                                            size={24}
                                            color='rgba(0,0,0,0.54)'
                                        />
                                    </TouchableOpacity>
                                    :
                                    <View style={{ width: 24 }}></View>
                            }

                        </View>

                    </View>


                    <Text style={styles.title}>{currentReadChapter.data.name}</Text>

                    {/* STATUS ICON */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                        <View style={styles.statusWrapper}>
                            <AntDesign
                                name='eye'
                                size={22}
                                color='dodgerblue'
                            />
                            <Text style={styles.statusText}>{currentReadChapter.data.reads ? currentReadChapter.data.reads : 0} lượt xem</Text>
                        </View>

                        <TouchableOpacity style={styles.statusWrapper}
                            onPress={() => {
                                this.handleLike(currentReadChapter)
                                this.forceUpdate()
                            }}
                        >
                            <AntDesign
                                name='star'
                                size={22}
                                color={currentReadChapter.data.likes ? currentReadChapter.data.likes.includes(auth.currentUser.uid) ? 'orange' : 'rgba(0,0,0,0.54)' : 'rgba(0,0,0,0.54)'}
                            />
                            <Text style={styles.statusText}>{currentReadChapter.data.likes ? currentReadChapter.data.likes.length : 0} lượt thích</Text>
                        </TouchableOpacity>

                        {/* <Comment
                                    chapter={chapter}
                                /> */}


                    </View>

                    {/* CHAPTER IMAGE */}
                    {
                        currentReadChapter.data.imageUrl &&
                        <TouchableOpacity
                            onPress={() => this.setState({ dialogImageVisible: true })}
                        >
                            <Image
                                style={styles.imageChapter}
                                source={{ uri: `${currentReadChapter.data.imageUrl}` }}
                            />
                        </TouchableOpacity>
                    }

                    <ShowImage
                        visible={this.state.dialogImageVisible}
                        title=""
                        onTouchOutside={() => this.setState({ dialogImageVisible: false })}
                        widthImage={266}
                        heightImage={154}
                        sourceImage={currentReadChapter.data.imageUrl}
                    />


                    {/* CONTENT */}
                    <Text style={styles.chapterContent}>{currentReadChapter.data.content.split('\n').map(pharagraph => `\t\t${pharagraph}\n\n`).join('')}</Text>
                </ScrollView>
            </View>
        )
    }
}

ReadBook.contextType = ReadBookContext

const styles = StyleSheet.create({
    arrow: {
        width: 16,
        height: 16
    },
    container: {
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: 'white'
    },
    statusWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 33,
        marginBottom: 19
    },
    imageChapter: {
        width: 328 / 360 * widthScreen,
        height: 188 / 360 * widthScreen,
        marginBottom: 27
    },
    title: {
        fontSize: 24,
        color: 'rgba(0, 0, 0, 0.87)',
        alignSelf: 'center',
    },
    volumeIcon: {
        width: 24,
        height: 24,
        alignSelf: 'flex-end',
        marginRight: 24
    },
    chapterContent: {
        textAlign: 'justify',
        fontSize: 16,
        color: 'rgba(0,0,0,0.57)'
    },
    statusText: {
        color: 'rgba(0, 0, 0, 0.57)',
        marginLeft: 6
    }
})