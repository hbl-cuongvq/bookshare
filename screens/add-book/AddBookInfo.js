import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native'

import { AddBookContext } from '../../contexts/AddBook'

import Entypo from 'react-native-vector-icons/Entypo'

import { Input } from 'react-native-elements'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

const borderColor = {
    active: 'rgba(244, 67, 54, 1)',
    inActive: 'rgba(0, 0, 0, 0.54)'
}

export default class AddBookInfo extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tempImage: null,
            bookNameBorderColor: borderColor.inActive,
            bookDescriptionBorderColor: borderColor.inActive
        }

        this.bookNameRef = React.createRef()
        this.bookDescriptionRef = React.createRef()

        this.onChangeText = this.onChangeText.bind(this)
    }

    onChangeText = (text) => {
        if (this.bookNameRef.current.isFocused()) {
            this.setState({
                bookName: text
            })
        }

        if (this.bookDescriptionRef.current.isFocused()) {
            this.setState({
                bookDescription: text
            })
        }
    }

    FocusBorderColor = () => {
        if (this.bookNameRef.current.isFocused()) {
            this.setState({
                bookNameBorderColor: borderColor.active
            })
        }

        if (this.bookDescriptionRef.current.isFocused()) {
            this.setState({
                bookDescriptionBorderColor: borderColor.active
            })
        }
    }

    EndEditingBorderColor = () => {
        if (!this.bookNameRef.current.isFocused()) {
            this.setState({
                bookNameBorderColor: borderColor.inActive
            })
        }

        if (!this.bookDescriptionRef.current.isFocused()) {
            this.setState({
                bookDescriptionBorderColor: borderColor.inActive
            })
        }
    }

    render() {

        return (

            <KeyboardAvoidingView
                style={{
                    backgroundColor: 'white',
                    flex: 1
                }}

                behavior='position'
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {/* BOOK IMAGE */}
                    <AddBookContext.Consumer>
                        {
                            ({ imageUrl, pickImageHandler }) => {
                                return imageUrl ?
                                    <TouchableOpacity
                                        style={styles.bookImageCover}
                                        onPress={pickImageHandler}
                                    >
                                        {/* HAVE IMAGE */}
                                        <Image
                                            style={styles.bookImage}
                                            source={{ uri: imageUrl }}
                                        />
                                        <Text style={{ color: 'rgba(0,0,0,0.54)' }}>Nhấp vào ảnh để thay đổi!</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={styles.noImageContainer}
                                        onPress={pickImageHandler}
                                    >
                                        {/* HAVEN'T IMAGE */}
                                        <View style={styles.noImageWrapper}>
                                            <Entypo
                                                name='plus'
                                                size={48}
                                                color='rgba(0, 0, 0, 0.57)'
                                            />
                                        </View>

                                        <Text
                                            style={styles.textImage}
                                        >Thêm một bìa</Text>
                                    </TouchableOpacity>
                            }
                        }
                    </AddBookContext.Consumer>

                    <AddBookContext.Consumer>
                        {
                            ({ name, setName, description, setDescription }) =>
                                <View style={{ paddingTop: 24 }}>
                                    {/* BOOKNAME TEXTINPUT */}
                                    <Input
                                        label='Tiêu đề truyện'
                                        onChangeText={(text) => setName(text)}
                                        value={name}
                                    />

                                    {/* BOOK DESCRIPTION TEXTINPUT */}
                                    <Input
                                        label='Mô tả truyện'
                                        multiline={true}
                                        onChangeText={(text) => setDescription(text)}
                                        value={description}
                                    />
                                </View>
                        }
                    </AddBookContext.Consumer>


                    <AddBookContext.Consumer>
                        {({ selectedBookId }) => {
                            if (selectedBookId) {
                                return <View>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: 'rgba(0,0,0,0.32)',
                                            textAlign: 'center'
                                        }}
                                    >Bổ sung thông tin</Text>
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 8,
                                            marginBottom: 24
                                        }}
                                        onPress={() => {
                                            this.props.navigation.navigate('CategoriesAndTags')
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'rgba(0,0,0,0.54)',
                                                fontSize: 16,
                                                textDecorationLine: 'underline',
                                                textAlign: 'center',
                                            }}
                                        >Thêm tác giả, thể loại và tag truyện</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            else return null
                        }}
                    </AddBookContext.Consumer>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    bookImageCover: {
        backgroundColor: 'white',
        width: widthScreen,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8
    },
    bookImage: {
        width: 200 / 360 * widthScreen,
        height: 200 / 5 * 7 / 640 * heightScreen,
    },
    noImageContainer: {
        width: widthScreen,
        height: 153,
        backgroundColor: 'rgba(0,0,0,0.16)',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    noImageWrapper: {
        width: 80,
        height: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.32)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textImage: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.57)',
        marginLeft: 17,
        fontWeight: 'bold'
    },
    textInput: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 25,
        borderBottomWidth: 1,
        paddingBottom: 8,
        paddingTop: 4,
        paddingLeft: 8
    }
})