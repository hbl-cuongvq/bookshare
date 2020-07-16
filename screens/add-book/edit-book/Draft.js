import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native'

import Modal from 'react-native-modal'

import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

import { getUserDraftBooks } from '../../../api/book/getUserBooks'
import { AddBookContext } from '../../../contexts/AddBook'

import { dateFormat, timeFromNow } from '../../../dateFormat'

export default class Draft extends Component {
    constructor(props) {
        super(props)

        this.state = {
            books: [],
            refreshList: true,
            visible: false,
            selectBook: null
        }

        this.setBooks = this.setBooks.bind(this)
        this.setVisible = this.setVisible.bind(this)
        this.loadList = this.loadList.bind(this)
    }

    setVisible = (visible) => {
        this.setState({
            visible: visible
        })
    }

    setBooks = (books) => {
        this.setState({
            books: books
        })
    }

    loadList = async () => {
        let loadedList = await getUserDraftBooks(this.setBooks)

        this.setState({
            refreshList: !loadedList
        })
    }

    async componentDidMount() {
        await this.loadList()
    }

    render() {
        const { books } = this.state

        return (
            <View
                style={{
                    paddingLeft: 16,
                    backgroundColor: 'white',
                    flex: 1
                }}
            >
                {
                    books.length === 0 ?
                        <Text
                            style={{
                                alignSelf: 'center',
                                marginTop: 26,
                                color: 'rgba(0,0,0,0.54)'
                            }}
                        >Chưa có bản thảo nào</Text>
                        :
                        <FlatList
                            refreshing={this.state.refreshList}
                            onRefresh={this.loadList}
                            data={books}
                            renderItem={({ item }) =>
                                <AddBookContext.Consumer>
                                    {
                                        ({ setSelectedBook, setName, setDescription, setImageUrl, setImage, imageUrl, setCategories, setTag, setAuthor }) =>
                                            <View
                                                style={{
                                                    marginTop: 26,
                                                    flexDirection: 'row'
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        await setSelectedBook(item.id, item.data)
                                                        await setName(item.data.name)
                                                        await setDescription(item.data.description)
                                                        await setImageUrl(item.data.imageUrl)
                                                        await setCategories(item.data.categories ? item.data.categories : [])
                                                        await setTag(item.data.tags ? item.data.tags : [])
                                                        await setAuthor(item.data.author)
                                                        if (imageUrl) await setImage(null)

                                                        this.props.navigation.navigate('AddBookInfo')
                                                    }}
                                                >
                                                    <Image
                                                        style={{
                                                            width: 100 / 360 * widthScreen,
                                                            height: 140 / 640 * heightScreen
                                                        }}
                                                        source={{ uri: `${item.data.imageUrl ? item.data.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                                                    />
                                                </TouchableOpacity>


                                                <View style={{
                                                    marginLeft: 24
                                                }}>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            width: 204 / 360 * widthScreen
                                                        }}
                                                    >
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={async () => {
                                                                    await setSelectedBook(item.id, item.data)
                                                                    await setName(item.data.name)
                                                                    await setDescription(item.data.description)
                                                                    await setImageUrl(item.data.imageUrl)
                                                                    await setCategories(item.data.categories ? item.data.categories : [])
                                                                    await setTag(item.data.tags ? item.data.tags : [])
                                                                    await setAuthor(item.data.author)
                                                                    if (imageUrl) await setImage(null)

                                                                    this.props.navigation.navigate('AddBookInfo')
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: 20,
                                                                        color: 'rgba(0, 0, 0, 0.87)'
                                                                    }}
                                                                >{item.data.name}</Text>
                                                            </TouchableOpacity>

                                                            <Text
                                                                style={{
                                                                    fontSize: 14,
                                                                    color: 'rgba(0, 0, 0, 0.54)'
                                                                }}
                                                            >{item.data.created && `Ngày tạo: ${dateFormat(item.data.created.seconds)}`}</Text>
                                                            <Text
                                                                style={{
                                                                    fontSize: 14,
                                                                    color: 'rgba(0, 0, 0, 0.54)'
                                                                }}
                                                            >{item.data.lastEdited && `Cập nhật cuối: ${timeFromNow(item.data.lastEdited.seconds)}`}</Text>
                                                        </View>

                                                        <TouchableOpacity
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 32,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}

                                                            onPress={() => {
                                                                this.setState({
                                                                    selectBook: item
                                                                })

                                                                this.setVisible(true)
                                                            }}
                                                        >
                                                            <Entypo
                                                                name='dots-three-vertical'
                                                                size={24}
                                                                color='rgba(0,0,0,0.54)'
                                                            />
                                                        </TouchableOpacity>

                                                        <ModalComponent
                                                            {...this.props}
                                                            book={this.state.selectBook}
                                                            visible={this.state.visible}
                                                            setVisible={this.setVisible}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                    }
                                </AddBookContext.Consumer>
                            }
                            keyExtrator={(item) => item.id}
                        />
                }
            </View>
        )
    }
}



class ModalComponent extends Component {
    render() {
        const { props } = this
        const { book } = this.props
        return book &&
            <Modal
                isVisible={props.visible}
                onBackdropPress={() => props.setVisible(false)}
                onBackButtonPress={() => props.setVisible(false)}
                swipeDirection={'left'}
                backdropOpacity={0}
                style={{
                    margin: 0
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        bottom: 0,
                        padding: 16,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        width: widthScreen,
                        elevation: 15,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            marginBottom: 16,
                            alignItems: 'center'
                        }}
                    >
                        {/* BOOK IMAGE */}
                        <Image
                            style={{
                                width: 50,
                                height: 70,
                                marginRight: 8
                            }}
                            source={{ uri: book.data.imageUrl }}
                        />
                        {/* BOOK NAME */}
                        <Text style={styles.bookNameModal}>{book.data.name}</Text>
                    </View>

                    <AddBookContext.Consumer>
                        {
                            ({
                                setSelectedBook,
                                setName,
                                setDescription,
                                setImageUrl,
                                setImage,
                                imageUrl,
                                publishBook,
                                deleteBook,
                                setCategories,
                                setTag,
                                categories,
                                tags,
                                setAuthor
                            }) => (
                                    <View>
                                        <TouchableOpacity
                                            style={styles.optionWrapper}
                                            onPress={async () => {
                                                await setSelectedBook(book.id, book.data)
                                                await setName(book.data.name)
                                                await setDescription(book.data.description)
                                                await setImageUrl(book.data.imageUrl)
                                                await setCategories(book.data.categories ? book.data.categories : [])
                                                await setTag(book.data.tags ? book.data.tags : [])
                                                await setAuthor(book.data.author)
                                                if (imageUrl) await setImage(null)

                                                props.setVisible(false)
                                                props.navigation.navigate('AddChapterInfo')
                                            }}
                                        >
                                            <Entypo
                                                name='list'
                                                size={24}
                                                color='rgba(0,0,0,0.54)'
                                            />
                                            <Text style={styles.textModal}>Danh sách chương</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.optionWrapper}
                                            onPress={async () => {
                                                await setSelectedBook(book.id, book.data)
                                                await setName(book.data.name)
                                                await setDescription(book.data.description)
                                                await setImageUrl(book.data.imageUrl)
                                                await setCategories(book.data.categories ? book.data.categories : [])
                                                await setTag(book.data.tags ? book.data.tags : [])
                                                await setAuthor(book.data.author)
                                                if (imageUrl) await setImage(null)

                                                props.setVisible(false)
                                                props.navigation.navigate('AddBookInfo')
                                            }}
                                        >
                                            <Entypo
                                                name='book'
                                                size={24}
                                                color='rgba(0,0,0,0.54)'
                                            />
                                            <Text style={styles.textModal}>Sửa thông tin truyện</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.optionWrapper}
                                            onPress={async () => {
                                                await setSelectedBook(book.id, book.data)
                                                await setName(book.data.name)
                                                await setDescription(book.data.description)
                                                await setImageUrl(book.data.imageUrl)
                                                await setCategories(book.data.categories ? book.data.categories : [])
                                                await setTag(book.data.tags ? book.data.tags : [])
                                                await setAuthor(book.data.author)
                                                if (imageUrl) await setImage(null)

                                                props.setVisible(false)
                                                this.props.navigation.navigate('CategoriesAndTags')
                                            }}
                                        >
                                            <AntDesign
                                                name='tags'
                                                size={24}
                                                color='rgba(0,0,0,0.54)'
                                            />
                                            <Text style={styles.textModal}>Tác giả, thể loại và tag</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.optionWrapper}
                                            onPress={async () => {
                                                await setSelectedBook(book.id, book.data)
                                                await setName(book.data.name)
                                                await setDescription(book.data.description)
                                                await setImageUrl(book.data.imageUrl)
                                                if (imageUrl) await setImage(null)

                                                props.setVisible(false)
                                                publishBook()
                                            }}
                                        >
                                            <Entypo
                                                name='publish'
                                                size={24}
                                                color='rgba(0,0,0,0.54)'
                                            />
                                            <Text style={styles.textModal}>Xuất bản</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.optionWrapper, styles.deleteWrapper]}
                                            onPress={() => {
                                                props.setVisible(false)
                                                deleteAlert(book.id, book.data.name, deleteBook)
                                            }}
                                        >
                                            <Text style={[styles.textModal, styles.textDelete]}>Xoá truyện</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                        }
                    </AddBookContext.Consumer>
                </View>
            </Modal>
    }
}

const deleteAlert = (bookId, bookName, deleteBookFunction) =>
    Alert.alert(
        `${bookName}`,
        `Bạn có chắc chắn muốn xoá?`,
        [
            {
                text: "Huỷ",
                onPress: () => null,
                style: "cancel"
            },
            { text: "Xác nhận", onPress: () => deleteBookFunction(bookId) }
        ],
        { cancelable: false }
    )

const styles = StyleSheet.create({
    bookNameModal: {
        fontSize: 24,
        color: 'rgba(0,0,0,0.87)',
        textAlign: 'center',
        marginBottom: 16
    },
    textModal: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.54)',
        marginLeft: 8,
        marginBottom: 16
    },
    optionWrapper: {
        flexDirection: 'row',
    },
    deleteWrapper: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.54)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textDelete: {
        color: 'red',
        marginTop: 16
    }
})
