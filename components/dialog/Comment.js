import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Dimensions,
    FlatList
} from 'react-native'
import RBSheet from "react-native-raw-bottom-sheet";

const widthScreen = Dimensions.get('window').width

export default class Comment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: []
        }
    }

    onShowComment() {
        this.RBSheet.open()


        this.setState({
            comments: [
                {
                    username: 'user1',
                    avatar: 'https://loremflickr.com/48/48',
                    timestape: '16h 30p',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
                },
                {
                    username: 'user2',
                    avatar: 'https://loremflickr.com/48/48',
                    timestape: '17h 30p',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
                },
                {
                    username: 'userAAA',
                    avatar: 'https://loremflickr.com/48/48',
                    timestape: '16h',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
                }, {
                    username: 'username4',
                    avatar: 'https://loremflickr.com/48/48',
                    timestape: '15h',
                    content: 'Lorem ipsum dolor sit amet'
                },
                {
                    username: 'username5',
                    avatar: 'https://loremflickr.com/48/48',
                    timestape: '15h',
                    content: 'Lorem ipsum dolor sit amet'
                },
                {
                    username: 'username6',
                    avatar: 'https://loremflickr.com/48/48',
                    timestape: '15h',
                    content: 'Lorem ipsum dolor sit amet'
                }
            ]
        })
    }

    render() {
        const { chapter } = this.props
        const { comments } = this.state

        return (
            <View style={styles.statusWrapper}>

                <TouchableOpacity
                    onPress={() => this.onShowComment()}
                    style={{ flexDirection: 'row' }}
                >
                    <Image
                        style={{
                            width: 19,
                            height: 19
                        }}
                        source={require('../../assets/commentIcon.png')}
                    />
                    <Text style={styles.statusText}>{chapter.status.comments}</Text>
                </TouchableOpacity>

                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={370}
                    openDuration={300}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            paddingLeft: 16,
                            paddingRight: 16,
                            paddingTop: 16
                        }
                    }}
                >
                    {/* CONTENT */}
                    <View style={{ marginBottom: -262 }}>
                        {/* EXIT ICON  */}
                        <TouchableOpacity
                            style={{
                                marginTop: -272,
                                alignSelf: 'flex-end'
                            }}

                            onPress={() => this.RBSheet.close()}
                        >
                            <Image
                                style={{
                                    width: 14,
                                    height: 14,
                                }}
                                source={require('../../assets/exitIcon.png')}
                            />
                        </TouchableOpacity>


                        <View
                            style={styles.commentsWrapper}
                        >
                            {/* LOAD COMMENT */}

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={comments}
                                keyExtractor={item => item.username}
                                renderItem={({ item }) =>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginBottom: 24
                                        }}
                                    >
                                        <TouchableOpacity>
                                            <Image
                                                style={{
                                                    width: 46,
                                                    height: 46,
                                                    borderRadius: 46
                                                }}
                                                source={{ uri: item.avatar }}
                                            />
                                        </TouchableOpacity>

                                        <View style={{ marginLeft: 8 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        marginRight: 8,
                                                        fontSize: 16
                                                    }}
                                                >{item.username}</Text>
                                                <Text style={{
                                                    color: 'rgba(0,0,0,0.37)',
                                                    alignSelf: 'center'
                                                }}>{item.timestape}</Text>
                                            </View>
                                            <Text style={{
                                                color: 'rgba(0,0,0,0.87)'
                                            }}>{item.content}</Text>
                                        </View>

                                    </View>
                                }
                            />
                        </View>

                        {/* INPUT */}
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Nhập bình luận ..."
                                placeholderTextColor='rgba(0,0,0,0.57)'
                            />

                            <TouchableOpacity
                                style={styles.sendButton}
                            >
                                <Image
                                    style={styles.sendIcon}
                                    source={require('../../assets/sendIcon.png')}
                                />
                            </TouchableOpacity>

                        </View>
                    </View>
                </RBSheet>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    statusWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 33,
        marginBottom: 19
    },
    statusText: {
        color: 'rgba(0, 0, 0, 0.57)',
        marginLeft: 6
    },
    sendButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(0,0,0,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 48,
        marginLeft: 8
    },
    sendIcon: {
        width: 24,
        height: 21,
        marginLeft: -4
    },
    commentInput: {
        width: 272 / 360 * widthScreen,
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderRadius: 48,
        paddingLeft: 16,
        paddingRight: 16,
        color: 'rgba(0,0,0,0.87)'
    },
    commentsWrapper: {
        marginTop: 8,
        marginBottom: 12,
        height: 260
    }
})