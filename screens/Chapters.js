import React, { Component } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator
} from 'react-native'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

import { ReadBookContext } from '../contexts/ReadBook'
import Feather from 'react-native-vector-icons/Feather'
import Toast from 'react-native-simple-toast';

import { timeFromNow } from '../dateFormat'

export default class Chapters extends Component {


    async componentDidMount() {
        let value = this.context
        try {
            await value.getChaptersToRead(value.readBookId)

        } catch (err) {
            Toast.show(err)
        }
    }


    render() {
        return (
            <ReadBookContext.Consumer>
                {
                    ({
                        chapters,
                        readBook,
                        setCurrentReadChapter,
                        addReadsChapter,
                        readBookId,
                        setCurrentReadChapterId
                    }) => {
                        return (
                            chapters &&
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 16,
                                    backgroundColor: 'white'
                                }}
                            >
                                {/* back arrow */}
                                <Feather
                                    name='arrow-left'
                                    size={24}
                                    color='rgba(0,0,0,0.54)'
                                    style={{
                                        paddingTop: 20,
                                        paddingBottom: 20
                                    }}
                                    onPress={() => this.props.navigation.goBack()}
                                />

                                {/* image */}
                                <Image
                                    style={{
                                        width: 160 / 360 * widthScreen,
                                        height: 224 / 360 * widthScreen,
                                        alignSelf: 'center'
                                    }}
                                    source={{ uri: `${readBook.imageUrl ? readBook.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                                />

                                {/* BOOK NAME */}
                                <Text style={{
                                    fontSize: 20,
                                    marginTop: 16,
                                    marginBottom: 8,
                                    textAlign: 'center',
                                    color: 'rgba(0,0,0,0.87)'
                                }}>{readBook.name}</Text>
                                {
                                    readBook.author &&
                                    <Text style={{
                                        fontSize: 16,
                                        textAlign: 'center',
                                        color: 'rgba(0,0,0,0.54)'
                                    }}>Tác giả: {readBook.author}</Text>
                                }
                                <Text
                                    style={{
                                        fontSize: 12,
                                        textAlign: 'center',
                                        color: 'rgba(0,0,0,0.32)',
                                        borderBottomColor: 'rgba(0,0,0,0.32)',
                                        paddingBottom: 16,
                                        borderBottomWidth: 1
                                    }}
                                >Cập nhật cuối: {timeFromNow(readBook.lastEdited.seconds)}</Text>


                                {
                                    chapters.length === 0 ?
                                        <ActivityIndicator size='large'
                                            style={{
                                                marginTop: 20
                                            }}
                                        />
                                        :
                                        <FlatList
                                            data={chapters}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item }) =>
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 8,
                                                        borderWidth: 1,
                                                        borderColor: 'rgba(0,0,0,0.32)',
                                                        marginBottom: 4,
                                                        borderRadius: 8
                                                    }}

                                                    onPress={async () => {
                                                        setCurrentReadChapter(null)
                                                        setCurrentReadChapterId(item.id)
                                                        try {
                                                            await addReadsChapter(readBookId, item.id)
                                                        } catch (err) {
                                                            Toast.show(err)
                                                        }
                                                        setCurrentReadChapter(chapters.find(chapter => chapter.id === item.id))
                                                        this.props.navigation.navigate('ReadBook')
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: 'rgba(0,0,0,0.87)'
                                                        }}
                                                    >{item.data.name}</Text>
                                                </TouchableOpacity>
                                            }
                                            style={{
                                                marginTop: 24
                                            }}
                                        />
                                }

                            </View>
                        )
                    }
                }
            </ReadBookContext.Consumer>
        )
    }
}

Chapters.contextType = ReadBookContext