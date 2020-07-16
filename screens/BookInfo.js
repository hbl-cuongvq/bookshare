import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    FlatList
} from 'react-native'

import {
    getAllCommentFromBook,
    addNewCommentToBook
} from '../api/comment/commentApi'

import Highlighter from 'react-native-highlight-words'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { deleteStoreBook } from '../api/user/addReadBookLibrary'

import { auth, db } from '../api/DBConfig'

import Modal from 'react-native-modal'

import { ReadBookContext } from '../contexts/ReadBook'

import ShowImage from '../components/dialog/ShowImage'

import Seen from '../components/status/Seen'
import Like from '../components/status/Like'
import Chapter from '../components/status/Chapter'

import SearchBar from '../components/SearchTab'

import { timeFromNow } from '../dateFormat'
import Toast from 'react-native-simple-toast'


const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

colors = [
    'midnightblue',
    'hotpink',
    'limegreen',
    'violet',
    'tomato',
    'gold',
    'dimgray',
    'purple',
    'teal',
    'steelblue'
]

export default class BookInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dialogImageVisible: false,
            visible: false,
            avatarUrl: null,
            widthScreen: Dimensions.get('window').width,
            heightScreen: Dimensions.get('window').height,
            bookStored: null,
            comment: '',
            comments: [],
            lastIndex: 0,
            end: null,
        }

        this.setCloseBookInfo = this.setCloseBookInfo.bind(this)
        this.readBook = this.readBook.bind(this)
        this.setVisible = this.setVisible.bind(this)
        this.setBookStored = this.setBookStored.bind(this)
        this.setComment = this.setComment.bind(this)
        this.setComments = this.setComments.bind(this)
        this.setEnd = this.setEnd.bind(this)
    }

    setEnd = end => this.setState({ end })

    setComment = comment => this.setState({ comment })
    setComments = comments => this.setState({ comments })

    setBookStored = bookStored => this.setState({ bookStored })

    setVisible = visible => this.setState({ visible })

    setCloseBookInfo = () => {
        this.setVisible(false)
    }

    readBook() {
        this.setVisible(false)
        this.props.navigation.navigate('Chapters')
    }

    async componentDidMount() {
        const { uid } = this.props.bookInfo
        const { bookId } = this.props

        try {
            // get userId of book
            // get avatar
            let user = await db.collection('users').doc(uid).get()
            if (user.exists) {
                let avatarUrl = user.data().avatarUrl
                this.setState({ avatarUrl })
            }

            // get current signin user
            if (auth.currentUser.uid) {
                let yourUser = await db.collection('users')
                    .doc(auth.currentUser.uid).get()
                // check stored current book 
                if (yourUser.exists) {
                    let storeBookId = yourUser.data().storeBookId
                    if (storeBookId && storeBookId.length > 0) {
                        let hasStored = storeBookId.includes(bookId)
                        this.setBookStored(hasStored)
                    } else {
                        this.setBookStored(false)
                    }
                }
            }
        } catch (err) {
            Toast.show(err)
        }
    }

    render() {
        const {
            onShowBookOptions,
            bookInfo,
            touchType,
            searchType,
            searchWord,
            bookId
        } = this.props

        const {
            bookStored,
            comment,
            comments,
            end
        } = this.state

        return (
            <View
                style={{
                    paddingVertical: touchType === "categoryImage" ? 34 : 0,
                    backgroundColor: 'transparent'
                }}
            >
                {
                    touchType === "categoryImage" &&
                    <ReadBookContext.Consumer>
                        {({ setReadBookId,
                            addSeen,
                            addReadBook,
                            addStoreBook,
                            setReadBook,
                            setChapters,
                            checkBookExist,
                            addLike,
                            deleteLike
                        }) =>
                            (
                                <View View
                                    style={{
                                        padding: 10,
                                        backgroundColor: 'white',
                                        marginRight: 8,
                                        borderRadius: 34,
                                        width: 150
                                    }}
                                >
                                    {
                                        auth.currentUser.uid &&
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                zIndex: 999999,
                                                padding: 5,
                                                backgroundColor: 'white',
                                                borderRadius: 60,
                                                top: -20,
                                                left: 30,
                                            }}

                                            onPress={async () => {
                                                if (!bookInfo.like) {
                                                    // add
                                                    await addLike(this.props.bookId)
                                                } else {
                                                    let hasLike = bookInfo.like.includes(auth.currentUser.uid)
                                                    if (hasLike) {
                                                        // delete
                                                        await deleteLike(this.props.bookId)
                                                    } else {
                                                        // add
                                                        await addLike(this.props.bookId)
                                                    }
                                                }
                                            }}
                                        >
                                            <AntDesign
                                                name={'star'}
                                                size={28}
                                                color={!bookInfo.like ? 'lightgray' : bookInfo.like.includes(auth.currentUser.uid) ? 'orange' : 'lightgray'}
                                            />
                                        </TouchableOpacity>
                                    }

                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            zIndex: 999999,
                                            padding: 5,
                                            backgroundColor: 'white',
                                            borderRadius: 60,
                                            top: -20,
                                            left: 80,
                                        }}

                                        onPress={async () => {
                                            try {
                                                let isExist = await checkBookExist(this.props.bookId)
                                                if (!isExist) {
                                                    throw 'Book deleted!'
                                                }
                                                if (bookStored) {
                                                    Alert.alert(
                                                        'Xác nhận',
                                                        `Truyện "${bookInfo.name}" sẽ được xoá khỏi thư viện lưu trữ`,
                                                        [
                                                            {
                                                                text: "Xoá", onPress: async () => {
                                                                    await deleteStoreBook(this.props.bookId);
                                                                    Toast.show('Book deleted');
                                                                    this.setBookStored(false)
                                                                }
                                                            },
                                                            {
                                                                text: "Huỷ",
                                                                style: "cancel"
                                                            }
                                                        ],
                                                        { cancelable: false }
                                                    )
                                                } else {
                                                    await addStoreBook(this.props.bookId)
                                                    this.setBookStored(true)
                                                    Toast.show('Book stored!')
                                                }
                                            } catch (err) {
                                                Toast.show(err)
                                            }

                                        }}
                                    >
                                        <AntDesign
                                            name='pluscircle'
                                            size={28}
                                            color={bookStored ? 'dodgerblue' : 'lightgray'}
                                        />
                                    </TouchableOpacity>


                                    <View
                                        style={{
                                            flex: 1
                                        }}
                                    >
                                        <TouchableOpacity
                                            onLongPress={onShowBookOptions}
                                            onPress={async () => {
                                                this.setVisible(true)
                                                this.setComments([])
                                                try {
                                                    // get comment
                                                    let { data, end } = await getAllCommentFromBook(bookId, comments.length)
                                                    this.setComments([...comments, ...data])
                                                    this.setEnd(end)
                                                } catch (err) {
                                                    Toast.show(err)
                                                }
                                            }}
                                        >
                                            <Image
                                                source={{ uri: `${bookInfo.imageUrl ? bookInfo.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                                                style={styles.image}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onLongPress={onShowBookOptions}
                                            onPress={async () => {
                                                this.setVisible(true)
                                                this.setComments([])
                                                try {
                                                    // get comment
                                                    let { data, end } = await getAllCommentFromBook(bookId, comments.length)
                                                    this.setComments([...comments, ...data])
                                                    this.setEnd(end)
                                                } catch (err) {
                                                    Toast.show(err)
                                                }
                                            }}
                                        >
                                            <Text
                                                lineBreakMode='tail'
                                                numberOfLines={1}
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 20,
                                                    marginTop: 8
                                                }}
                                            >{bookInfo.name}</Text>
                                        </TouchableOpacity>

                                        {
                                            bookInfo.author &&
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'rgba(0,0,0,0.54)'
                                                }}
                                            >{bookInfo.author}</Text>
                                        }

                                        <TouchableOpacity
                                            style={{
                                                alignSelf: 'stretch',
                                                backgroundColor: 'tomato',
                                                paddingVertical: 4,
                                                marginTop: 12,
                                                borderRadius: 30,
                                                marginHorizontal: 8,
                                                flex: 1
                                            }}

                                            onPress={async () => {
                                                try {
                                                    let isExist = await checkBookExist(this.props.bookId)
                                                    if (!isExist) {
                                                        throw 'Sách đã xoá!'
                                                    }

                                                    if (bookInfo.chapter && bookInfo.chapter.length > 0) {
                                                        await setChapters([])
                                                        await setReadBookId(this.props.bookId)
                                                        await setReadBook(bookInfo)
                                                        await addSeen(this.props.bookId)
                                                        await addReadBook(this.props.bookId)
                                                        this.readBook()
                                                    }
                                                    else throw 'Không có chương!'

                                                    if (this.props.RBSheet) {
                                                        this.props.RBSheet.close()
                                                    }
                                                    if (this.props.setCloseBookInfo) {
                                                        this.props.setCloseBookInfo()
                                                    }
                                                } catch (err) {
                                                    Toast.show(err)
                                                }
                                            }}
                                        >
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 20,
                                                textAlign: 'center'
                                            }}>ĐỌC</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                    </ReadBookContext.Consumer>
                }

                {
                    touchType === "titleBook" &&
                    <TouchableOpacity
                        onPress={async () => {
                            this.setVisible(true)
                            this.setComments([])
                            try {
                                // get comment
                                let { data, end } = await getAllCommentFromBook(bookId, comments.length)
                                this.setComments([...comments, ...data])
                                this.setEnd(end)
                            } catch (err) {
                                Toast.show(err)
                            }
                        }}
                    >
                        <Text style={styles.bookName}>{`${bookInfo.name}`}</Text>
                    </TouchableOpacity>
                }

                {
                    touchType === "titleBookLibrary" &&
                    <TouchableOpacity
                        onPress={() => {
                            this.setVisible(true)
                        }}
                        style={{
                            width: 200 / 360 * widthScreen
                        }}
                    >
                        <Text style={styles.bookNameLibrary}>{`${bookInfo.name}`}</Text>
                    </TouchableOpacity>
                }

                {
                    touchType === "bestBookImage" &&
                    <TouchableOpacity
                        onPress={async () => {
                            this.setVisible(true)
                            this.setComments([])
                            try {
                                // get comment
                                let { data, end } = await getAllCommentFromBook(bookId, comments.length)
                                this.setComments([...comments, ...data])
                                this.setEnd(end)
                            } catch (err) {
                                Toast.show(err)
                            }
                        }}
                        style={{
                            flex: 1
                        }}
                    >
                        <Image
                            style={styles.bestBookImage}
                            source={{ uri: `${bookInfo.imageUrl ? bookInfo.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                        />
                    </TouchableOpacity>
                }

                {
                    touchType === "bookImageLibrary" &&
                    <TouchableOpacity
                        onPress={() => this.setVisible(true)}
                    >
                        <Image
                            style={styles.bookLibraryImage}
                            source={{ uri: `${bookInfo.imageUrl ? bookInfo.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                        />
                    </TouchableOpacity>
                }

                {
                    touchType === "search" &&
                    <TouchableOpacity
                        onPress={() => this.setVisible(true)}
                        style={{
                            flexDirection: 'row',
                            marginBottom: 16
                        }}
                    >
                        <Image
                            style={{
                                width: 72,
                                height: 100
                            }}
                            source={{ uri: `${bookInfo.imageUrl ? bookInfo.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                        />
                        <View
                            style={{
                                marginLeft: 10,
                                justifyContent: 'center',
                            }}
                        >
                            {
                                searchType === 'bookTitle' ?
                                    <Highlighter
                                        highlightStyle={{ backgroundColor: 'lightgreen' }}
                                        searchWords={[searchWord.replace('!', '').trim().toLowerCase()]}
                                        textToHighlight={bookInfo.name.trim().toLowerCase()}
                                        style={{
                                            width: 246 / 360 * widthScreen,
                                            fontSize: 20,
                                            color: 'rgba(0,0,0,0.87)'
                                        }}
                                    />
                                    :
                                    <Text
                                        style={{
                                            width: 246 / 360 * widthScreen,
                                            fontSize: 20,
                                            color: 'rgba(0,0,0,0.87)'
                                        }}
                                    >{bookInfo.name.toLowerCase()}</Text>
                            }
                            {
                                (searchType === 'author' || searchType === 'tagUser' || searchType === 'bookTitle') &&
                                <View>
                                    {
                                        searchType === 'author' ?
                                            <View
                                                style={{
                                                    flexDirection: 'row'
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: 'rgba(0,0,0,0.54)',
                                                        fontSize: 16,
                                                        marginTop: 8
                                                    }}
                                                >Tác giả: </Text>
                                                <Highlighter
                                                    highlightStyle={{ backgroundColor: 'lightgreen' }}
                                                    searchWords={[searchWord.replace('&', '').trim().toLowerCase()]}
                                                    textToHighlight={bookInfo.author.trim().toLowerCase()}
                                                    style={{
                                                        color: 'rgba(0,0,0,0.54)',
                                                        fontSize: 16,
                                                        marginTop: 8
                                                    }}
                                                />
                                            </View>

                                            :
                                            <View>
                                                {
                                                    bookInfo.author ?
                                                        <Text
                                                            style={{
                                                                color: 'rgba(0,0,0,0.54)',
                                                                fontSize: 16,
                                                                marginTop: 8
                                                            }}
                                                        >Tác giả: {bookInfo.author}</Text>
                                                        :
                                                        <View style={{ marginBottom: 24 }}></View>
                                                }
                                            </View>


                                    }
                                    {
                                        searchType === 'tagUser' ?
                                            <View
                                                style={{
                                                    flexDirection: 'row'
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: 'rgba(0,0,0,0.54)',
                                                        fontSize: 14,
                                                        marginBottom: 8
                                                    }}
                                                >@</Text>
                                                <Highlighter
                                                    highlightStyle={{ backgroundColor: 'lightgreen' }}
                                                    searchWords={[searchWord.replace('@', '').trim().toLowerCase()]}
                                                    textToHighlight={bookInfo.authorTag.trim().toLowerCase()}
                                                    style={{
                                                        color: 'rgba(0,0,0,0.54)',
                                                        fontSize: 14,
                                                        marginBottom: 8
                                                    }}
                                                />
                                            </View>
                                            :
                                            <View>
                                                {
                                                    bookInfo.authorTag ?
                                                        <Text
                                                            style={{
                                                                color: 'rgba(0,0,0,0.54)',
                                                                fontSize: 14,
                                                                marginBottom: 8
                                                            }}
                                                        >@{bookInfo.authorTag}</Text>
                                                        : <View style={{ marginBottom: 22 }}></View>
                                                }
                                            </View>



                                    }
                                </View>
                            }

                            {
                                searchType === 'category' &&
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginHorizontal: 4,
                                        marginVertical: 4
                                    }}
                                >
                                    {
                                        bookInfo.categories &&
                                        bookInfo.categories.map((category, index) =>
                                            <Text
                                                key={index}
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 4,
                                                    backgroundColor:
                                                        category
                                                            .trim()
                                                            .toLowerCase()
                                                            .includes(
                                                                searchWord.replace('$', '').trim().toLowerCase()
                                                            ) ? 'lightgreen' : 'rgba(0,0,0,0.08)',
                                                    marginRight: 4,
                                                    fontWeight:
                                                        category
                                                            .trim()
                                                            .toLowerCase()
                                                            .includes(
                                                                searchWord.replace('$', '').trim().toLowerCase()
                                                            ) ? 'bold' : 'normal',
                                                }}
                                            >{category}</Text>
                                        )
                                    }
                                </View>
                            }

                            {
                                searchType === 'tag' &&
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginHorizontal: 4,
                                        marginVertical: 4
                                    }}
                                >
                                    {
                                        bookInfo.categories &&
                                        bookInfo.tags.map((tag, index) =>
                                            <Text
                                                key={index}
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 20,
                                                    backgroundColor:
                                                        tag
                                                            .trim()
                                                            .toLowerCase()
                                                            .includes(
                                                                searchWord.replace('#', '').trim().toLowerCase()
                                                            ) ? 'lightgreen' : 'rgba(0,0,0,0.08)',
                                                    marginRight: 4,
                                                    fontWeight:
                                                        tag
                                                            .trim()
                                                            .toLowerCase()
                                                            .includes(
                                                                searchWord.replace('#', '').trim().toLowerCase()
                                                            ) ? 'bold' : 'normal',
                                                }}
                                            >#{tag}</Text>
                                        )
                                    }
                                </View>
                            }
                            <Text
                                style={{
                                    color: 'rgba(0,0,0,0.32)',
                                    fontSize: 14
                                }}
                            >{bookInfo.lastEdited && `Cập nhật cuối: ${timeFromNow(bookInfo.lastEdited.seconds)}`}</Text>
                        </View>
                    </TouchableOpacity>
                }


                <Modal
                    style={{
                        flex: 1,
                        margin: 0,
                        backgroundColor: 'white',
                        zIndex: 0
                    }}
                    isVisible={this.state.visible}
                    onBackdropPress={() => this.setVisible(false)}
                    onBackButtonPress={() => this.setVisible(false)}
                >
                    {/* Content here */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.container}>
                            <Image
                                style={styles.bookImageBackground}
                                source={{ uri: `${bookInfo.imageUrl ? bookInfo.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                            />
                            <View style={styles.overlay}>
                                <TouchableOpacity
                                    onPress={() => this.setVisible(false)}
                                >
                                    <Image
                                        style={{ width: 16, height: 16, marginTop: 21, marginLeft: 16 }}
                                        source={require('../assets/arrowLeftIcon.png')}
                                    />
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity>
                                        <Image
                                            style={{ width: 22, height: 24, marginTop: 22, marginRight: 33 }}
                                            source={require('../assets/shareIcon.png')}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Image
                                            style={{ width: 6, height: 24, marginTop: 21, marginRight: 16 }}
                                            source={require('../assets/dotIcon.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Book image */}
                            <TouchableOpacity
                                onPress={() => this.setState({ dialogImageVisible: true })}
                            >
                                <Image
                                    style={styles.bookImage}
                                    source={{ uri: `${bookInfo.imageUrl ? bookInfo.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                                />
                            </TouchableOpacity>

                            {/* show image in dialog */}
                            <ShowImage
                                visible={this.state.dialogImageVisible}
                                title=""
                                onTouchOutside={() => this.setState({ dialogImageVisible: false })}
                                widthImage={265}
                                heightImage={371}
                                sourceImage={bookInfo.imageUrl}
                            />

                            <Text style={styles.title}>{bookInfo.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={styles.userImage}
                                    source={this.state.avatarUrl ? { uri: this.state.avatarUrl } : require('../assets/userIcon.png')}
                                />
                                <View>
                                    {
                                        bookInfo.author && <Text style={styles.author}>{bookInfo.author}</Text>
                                    }
                                    {
                                        bookInfo.authorTag && <Text style={styles.authorTag}>@{bookInfo.authorTag}</Text>
                                    }
                                </View>
                            </View>

                            <View style={styles.statusWrapper}>
                                <Seen index={bookInfo.seen > 0 ? bookInfo.seen : 0} />

                                <ReadBookContext.Consumer>
                                    {
                                        ({ addLike, deleteLike }) => auth.currentUser.uid && (
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    if (!bookInfo.like) {
                                                        // add
                                                        await addLike(this.props.bookId)
                                                    } else {
                                                        let hasLike = bookInfo.like.includes(auth.currentUser.uid)
                                                        if (hasLike) {
                                                            // delete
                                                            await deleteLike(this.props.bookId)
                                                        } else {
                                                            // add
                                                            await addLike(this.props.bookId)
                                                        }
                                                    }
                                                }}
                                            >
                                                <Like
                                                    index={bookInfo.like ? bookInfo.like.length : 0}
                                                    hasLike={!bookInfo.like ? false : bookInfo.like.includes(auth.currentUser.uid)}
                                                />
                                            </TouchableOpacity>
                                        )
                                    }
                                </ReadBookContext.Consumer>

                                <Chapter index={bookInfo.chapter ? bookInfo.chapter.length : 0} />
                            </View>


                            <ReadBookContext.Consumer>
                                {({ setReadBookId,
                                    addSeen,
                                    addReadBook,
                                    addStoreBook,
                                    setReadBook,
                                    setChapters,
                                    checkBookExist
                                }) => (
                                        <View style={{ flexDirection: 'row', marginBottom: 22 }}>
                                            <TouchableOpacity
                                                style={styles.readButton}
                                                onPress={async () => {
                                                    try {
                                                        let isExist = await checkBookExist(this.props.bookId)
                                                        if (!isExist) {
                                                            throw 'Sách đã xoá!'
                                                        }

                                                        if (bookInfo.chapter && bookInfo.chapter.length > 0) {
                                                            await setChapters([])
                                                            await setReadBookId(this.props.bookId)
                                                            await setReadBook(bookInfo)
                                                            await addSeen(this.props.bookId)
                                                            await addReadBook(this.props.bookId)
                                                            this.readBook()
                                                        }
                                                        else throw 'Không có chương!'

                                                        if (this.props.RBSheet) {
                                                            this.props.RBSheet.close()
                                                        }
                                                        if (this.props.setCloseBookInfo) {
                                                            this.props.setCloseBookInfo()
                                                        }
                                                    } catch (err) {
                                                        Toast.show(err)
                                                    }
                                                }}
                                            >
                                                <Text style={styles.readButtonText}>ĐỌC</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.addLibraryButton}
                                                onPress={async () => {
                                                    try {
                                                        let isExist = await checkBookExist(this.props.bookId)
                                                        if (!isExist) {
                                                            throw 'Book deleted!'
                                                        }
                                                        await addStoreBook(this.props.bookId)
                                                        Toast.show('Book stored!')
                                                    } catch (err) {
                                                        Toast.show(err)
                                                    }

                                                }}
                                            >
                                                <AntDesign
                                                    name='plus'
                                                    size={22}
                                                    color='rgba(0,0,0,0.64)'
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                            </ReadBookContext.Consumer>


                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginLeft: 16 }}
                            >
                                {
                                    bookInfo.tags && bookInfo.tags.map((tag, index) => (
                                        <SearchBar
                                            key={index}
                                            keyword={`#${tag}`}
                                            type="tagButton"
                                            tag={tag}
                                            navigation={this.props.navigation}
                                            setCloseBookInfo={this.setCloseBookInfo}
                                            color={colors[parseInt(Math.random() * 10)]}
                                        />
                                    ))
                                }
                            </ScrollView>
                        </View>

                        <Text style={styles.description}>{bookInfo.description.split("\n").map(paragraph => '       ' + paragraph + '\n\n').join("")}</Text>




                        {/* COMMENTS */}
                        {/* TYPE COMMENT */}
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    marginHorizontal: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 24
                                }}
                            >
                                <TextInput
                                    value={comment}
                                    onChangeText={text => this.setComment(text)}
                                    placeholder='Bình luận...'
                                    style={{
                                        flex: 1,
                                        padding: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'lightgray'
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={async () => {
                                        let user = auth.currentUser
                                        try {
                                            if (comment !== '') {
                                                let newComment = await addNewCommentToBook(comment, bookId, user.uid, user.displayName, user.photoURL)
                                                Toast.show('Commented!')
                                                this.setComment('')
                                                if (newComment) {
                                                    this.setComments([newComment, ...comments.filter(c => c.id !== newComment.id)])
                                                }
                                            } else {
                                                throw 'Chưa nhập bình luận!'
                                            }
                                        }
                                        catch (err) {
                                            Toast.show(err)
                                        }
                                    }}

                                    style={{
                                        padding: 5,
                                        paddingHorizontal: 8,
                                        borderRadius: 24,
                                        backgroundColor: 'dodgerblue'
                                    }}
                                >
                                    <Ionicons
                                        name='md-send'
                                        size={24}
                                        color='white'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* SHOW COMMENT */}
                        {
                            comments.length > 0 ?
                                <View>
                                    <FlatList
                                        data={comments}
                                        scrollEnabled={true}
                                        style={{
                                            flex: 1,
                                            marginBottom: 24
                                        }}
                                        contentContainerStyle={{
                                            flexGrow: 1
                                        }}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity style={{
                                                flexDirection: 'row',
                                                marginHorizontal: 16,
                                                marginBottom: 12,
                                                flex: 1
                                            }}>
                                                {
                                                    item.data.avatarUrl ?
                                                        <Image
                                                            style={{
                                                                width: 42,
                                                                height: 42,
                                                                borderRadius: 42
                                                            }}
                                                            source={{ uri: item.data.avatarUrl }}
                                                        />
                                                        :
                                                        <FontAwesome
                                                            name='user-circle-o'
                                                            size={42}
                                                            color='rgba(0,0,0,0.32)'
                                                        />
                                                }

                                                <View style={{
                                                    marginLeft: 8,
                                                    flex: 1,
                                                    justifyContent: 'center'
                                                }}>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text
                                                            style={{
                                                                fontWeight: 'bold'
                                                            }}
                                                        >{item.data.username}</Text>
                                                        <Text style={{
                                                            fontSize: 12,
                                                            color: 'rgba(0,0,0,0.16)'
                                                        }}> . {timeFromNow(item.data.created.seconds)}</Text>
                                                    </View>

                                                    <Text
                                                        style={{
                                                            flex: 1,
                                                            color: 'rgba(0,0,0,0.54)'
                                                        }}
                                                    >{item.data.content}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    />

                                    {
                                        end !== null && end === false &&
                                        <TouchableOpacity
                                            onPress={async () => {
                                                try {
                                                    // get new comment
                                                    let { data, end } = await getAllCommentFromBook(bookId, comments.length)
                                                    this.setComments([...comments, ...data])
                                                    this.setEnd(end)
                                                } catch (err) {
                                                    Toast.show(err)
                                                }
                                            }}

                                            style={{
                                                alignSelf: 'stretch',
                                                marginBottom: 24,
                                                backgroundColor: 'dodgerblue',
                                                marginHorizontal: 16,
                                                paddingVertical: 8,
                                                borderRadius: 6
                                            }}
                                        >
                                            <Text style={{ textAlign: 'center', color: 'white' }}>Thêm bình luận</Text>
                                        </TouchableOpacity>
                                    }

                                </View>
                                :
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'rgba(0,0,0,0.32)',
                                        marginBottom: 24
                                    }}
                                >Chưa có bình luận...</Text>
                        }

                    </ScrollView>
                </Modal>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    bookImageBackground: {
        width: widthScreen,
        height: 203 / 640 * heightScreen,
    },
    bookImage: {
        width: 180 / 360 * widthScreen,
        height: 252 / 640 * heightScreen,
        marginTop: -126 / 640 * heightScreen,
        marginBottom: 12,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.57)',
        width: widthScreen,
        height: 203 / 640 * heightScreen,
        marginTop: -203 / 640 * heightScreen,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userImage: {
        width: 26,
        height: 26,
        marginRight: 13,
        borderRadius: 26
    },
    title: {
        fontSize: 24,
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginHorizontal: 16,
        textAlign: 'center'
    },
    author: {
        fontSize: 14,
        paddingTop: 2,
        paddingBottom: 3
    },
    authorTag: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.54)',
        paddingTop: 2,
        paddingBottom: 2
    },
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16
    },
    readButton: {
        width: 75,
        height: 30,
        borderRadius: 8,
        backgroundColor: 'rgba(244, 67, 54, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    readButtonText: {
        color: 'white',
        fontSize: 14,
    },
    addLibraryButton: {
        width: 30,
        height: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    description: {
        marginLeft: 16,
        fontSize: 18,
        marginRight: 16,
        color: 'rgba(0, 0, 0, 0.54)',
        marginTop: 26,
        textAlign: 'justify'
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 30,
        flex: 1
    },
    bookName: {
        fontSize: 28,
        color: 'rgba(0,0,0,0.87)',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 4
    },
    bookNameLibrary: {
        fontSize: 20,
        color: 'rgba(0,0,0,0.87)',
        fontWeight: 'bold',
        marginRight: 8
    },
    bestBookImage: {
        width: 160 / 360 * widthScreen,
        height: 224 / 360 * widthScreen,
        borderRadius: 20
    },
    bookLibraryImage: {
        width: 100 / 360 * widthScreen,
        height: 140 / 640 * heightScreen,
        borderRadius: 20
    }
})