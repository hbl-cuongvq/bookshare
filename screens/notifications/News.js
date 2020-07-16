import React, { Component } from 'react'
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Image
} from 'react-native'

import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'

import Highlighter from 'react-native-highlight-words'

import { timeFromNow } from '../../dateFormat'

import NotificationListItem from '../../components/NotificationListItem'

import { NotificationContext } from '../../contexts/Notification'
import Toast from 'react-native-root-toast'


export default class News extends Component {
    render() {
        let value = this.context

        return (
            <View style={{ marginTop: 24, flex: 1, paddingHorizontal: 16 }}>
                {
                    value.messages.length > 0 ?
                        <FlatList
                            data={value.messages}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginBottom: 20,
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                    onPress={async () => {
                                        try {
                                            await value.setSeen(item.id)
                                        } catch (error) {
                                            Toast.show(error)
                                        }
                                    }}

                                    onLongPress={async () => {
                                        try {
                                            await value.deleteMessage(item.id)
                                        } catch (error) {
                                            Toast.show(error)
                                        }
                                    }}
                                >
                                    <Image
                                        style={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: 42
                                        }}
                                        source={{ uri: item.data.avatarUrl }}
                                    />
                                    <View
                                        style={{
                                            marginLeft: 8,
                                            flex: 1
                                        }}
                                    >
                                        <Highlighter
                                            highlightStyle={{
                                                fontWeight: 'bold'
                                            }}
                                            style={{
                                                fontSize: 16,
                                                flex: 1
                                            }}
                                            searchWords={[item.data.senderName, item.data.content.split(':')[1]]}
                                            textToHighlight={item.data.content}
                                        />
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {
                                                item.data.content.includes('thích') &&
                                                <AntDesign
                                                    name='star'
                                                    color='orange'
                                                    size={16}
                                                />
                                            }

                                            {
                                                item.data.content.includes('bình luận') &&
                                                <FontAwesome5
                                                    name='comments'
                                                    color='lime'
                                                    size={16}
                                                />
                                            }
                                            <Text
                                                style={{
                                                    color: 'rgba(0,0,0,0.32)',
                                                    fontSize: 12,
                                                    marginLeft: 4
                                                }}
                                            >{timeFromNow(item.data.created.seconds)}</Text>
                                        </View>
                                    </View>
                                    {
                                        item.data.seen === false ?
                                            <Entypo
                                                name='dot-single'
                                                size={30}
                                                color={'dodgerblue'}
                                            />
                                            :
                                            <View style={{ marginRight: 30 }}></View>
                                    }
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}

                            keyExtractor={(item) => `${item.id}`}
                        />
                        :
                        <Text
                            style={{
                                color: 'rgba(0,0,0,0.54)',
                                textAlign: 'center'
                            }}
                        >Không có thông báo...</Text>
                }

            </View>
        )
    }
}

News.contextType = NotificationContext