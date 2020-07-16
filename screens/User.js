
import React, { Component } from 'react'

import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    TextInput,
    RefreshControl
} from 'react-native'

import { auth, db, authProps } from '../api/DBConfig'

import * as SecureStore from 'expo-secure-store'

import Toast from 'react-native-simple-toast'

import * as ImagePicker from 'expo-image-picker'

import { uploadAvatar } from '../api/book/uploadImage'

import { getReadingBookLibrary, getStoreBookLibrary } from '../api/book/getBookLibrary'

import { getUserPublishBook } from '../api/book/getUserBooks'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { AuthContext } from '../contexts/Auth'
import { ReadBookContext } from '../contexts/ReadBook'

import AwesomeButton from 'react-native-really-awesome-button'

import Modal from 'react-native-modal';

import ShowImage from '../components/dialog/ShowImage'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

export default class User extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAvatar: false,
            showSettings: false,
            showChangeUserInfo: false,
            books: null,
            storeBooks: null,
            userBooks: [],
            isUploadAvatar: false,
            infoType: '',
            username: '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            currentPasswordSecurity: true,
            newPasswordSecurity: true,
            confirmNewPasswordSecurity: true,
            refreshing: false,
            publishedBooks: []
        }

        this.user = auth.currentUser
        this.getUserBooks = this.getUserBooks.bind(this)
        this.pickImageHandler = this.pickImageHandler.bind(this)
        this.setIsUploadAvatar = this.setIsUploadAvatar.bind(this)
        this.setBooks = this.setBooks.bind(this)
        this.setStoreBooks = this.setStoreBooks.bind(this)
        this.setUsername = this.setUsername.bind(this)
        this.setCurrentPassword = this.setCurrentPassword.bind(this)
        this.setNewPassword = this.setNewPassword.bind(this)
        this.setConfirmNewPassword = this.setConfirmNewPassword.bind(this)
        this.onUpdateUsername = this.onUpdateUsername.bind(this)
        this.onUpdatePassword = this.onUpdatePassword.bind(this)
        this.setCurrentPasswordSecurity = this.setCurrentPasswordSecurity.bind(this)
        this.setNewPasswordSecurity = this.setNewPasswordSecurity.bind(this)
        this.setConfirmNewPasswordSecurity = this.setConfirmNewPasswordSecurity.bind(this)
        this.initData = this.initData.bind(this)
        this.setRefreshing = this.setRefreshing.bind(this)
        this.setPublishedBooks = this.setPublishedBooks.bind(this)
    }

    setPublishedBooks = publishedBooks => this.setState({publishedBooks})
    setRefreshing = refreshing => this.setState({ refreshing })
    setUsername = username => this.setState({ username })
    setCurrentPassword = currentPassword => this.setState({ currentPassword })
    setNewPassword = newPassword => this.setState({ newPassword })
    setConfirmNewPassword = confirmNewPassword => this.setState({ confirmNewPassword })
    setCurrentPasswordSecurity = currentPasswordSecurity => this.setState({ currentPasswordSecurity })
    setNewPasswordSecurity = newPasswordSecurity => this.setState({ newPasswordSecurity })
    setConfirmNewPasswordSecurity = confirmNewPasswordSecurity => this.setState({ confirmNewPasswordSecurity })

    setBooks = books => {
        this.setState({ books })
    }

    setStoreBooks = storeBooks => {
        this.setState({ storeBooks })
    }

    setIsUploadAvatar = isUploadAvatar => {
        this.setState({ isUploadAvatar })
    }

    pickImageHandler = async () => {
        try {
            this.setIsUploadAvatar(true)
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            })

            if (!result.cancelled) {
                let url = await uploadAvatar(result)
                await auth.currentUser.updateProfile({
                    photoURL: url
                })
                await db.collection('users').doc(auth.currentUser.uid).update({
                    avatarUrl: url
                })
                this.setIsUploadAvatar(false)
            } else {
                this.setIsUploadAvatar(false)
            }

        } catch (E) {
            this.setState({
                image: null
            })
            return Toast.show(E)
        }
    }

    getUserBooks = (userBooks) => {
        this.setState({ userBooks })
    }

    initData = async () => {
        try {
            await getReadingBookLibrary(this.setBooks)
            await getStoreBookLibrary(this.setStoreBooks)
            await getUserPublishBook(this.setPublishedBooks)
        } catch (err) {
            Toast.show(err)
        }
    }

    componentDidMount() {
        this.initData()
    }

    onUpdateUsername = async () => {
        const { username } = this.state

        try {
            await auth.currentUser.updateProfile({
                displayName: username
            })
            let books = await db.collection('books')
                .where('uid', '==', auth.currentUser.uid)
                .get()
            books.forEach(async doc => {
                await db.collection('books').doc(doc.id).update({
                    authorTag: username
                })
            })

            this.setState({
                showChangeUserInfo: !this.state.showChangeUserInfo
            })
            this.setUsername('')
        } catch (err) {
            throw err
        }
    }

    onUpdatePassword = async () => {
        const {
            currentPassword,
            newPassword,
            confirmNewPassword,
        } = this.state

        try {
            if (currentPassword === '') throw 'Mật khẩu hiện tại trống!'
            if (newPassword === '') throw 'Mật khẩu mới trống!'
            if (newPassword !== confirmNewPassword) throw 'Mật khẩu mới không khớp!'
            if (currentPassword === newPassword) throw 'Không có gì để cập nhật!'

            let cred = authProps.EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
            await auth.currentUser.reauthenticateWithCredential(cred).then(async () => {
                try {
                    await auth.currentUser.updatePassword(newPassword)
                    this.setState({
                        showChangeUserInfo: !this.state.showChangeUserInfo
                    })
                    this.setCurrentPassword('')
                    this.setNewPassword('')
                    this.setConfirmNewPassword('')
                } catch (e) {
                    throw (e.toString())
                }
            })
                .catch(err => { throw err.toString() })
        } catch (err) {
            throw err
        }
    }

    render() {
        const {
            books,
            isUploadAvatar,
            storeBooks,
            username,
            currentPassword,
            newPassword,
            confirmNewPassword,
            currentPasswordSecurity,
            newPasswordSecurity,
            confirmNewPasswordSecurity,
            refreshing,
            publishedBooks
        } = this.state
        return (
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
                    this.setRefreshing(true)
                    this.initData()
                    this.setRefreshing(false)
                }} />}
                showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor: 'white'
                }}
            >
                <View
                    style={styles.avatarWrapper}
                >
                    {/* SETTING ICON */}
                    <TouchableOpacity
                        onPress={() => this.setState({ showSettings: !this.state.showSettings })}
                    >
                        <Image
                            style={styles.settingIcon}
                            source={require('../assets/settingIcon.png')}
                        />
                    </TouchableOpacity>

                    {/* SHOW USER INFO */}
                    <View>
                        {/* AVATAR */}
                        {
                            !isUploadAvatar ?
                                auth.currentUser.photoURL ?
                                    <View
                                        style={styles.avatar}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({ showAvatar: true })}
                                            onLongPress={() => {
                                                this.pickImageHandler()
                                            }}
                                        >
                                            <Image
                                                style={styles.avatar}
                                                source={{ uri: auth.currentUser.photoURL }}
                                            />
                                        </TouchableOpacity>
                                        <ShowImage
                                            visible={this.state.showAvatar}
                                            title=""
                                            onTouchOutside={() => this.setState({ showAvatar: false })}
                                            widthImage={265}
                                            heightImage={265}
                                            sourceImage={auth.currentUser.photoURL}
                                            avatar={true}
                                        />
                                    </View>
                                    :
                                    <TouchableOpacity
                                        style={[styles.avatar, {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 7,
                                            borderColor: 'white'
                                        }]}

                                        onLongPress={() => {
                                            this.pickImageHandler()
                                        }}
                                    >
                                        <FontAwesome5
                                            name='user'
                                            size={80}
                                            color='white'
                                        />
                                    </TouchableOpacity>

                                :
                                <View
                                    style={[styles.avatar, {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 7,
                                        borderColor: 'white',
                                        borderRadius: 265
                                    }]}
                                >
                                    <ActivityIndicator
                                        size='large'
                                        color='white'
                                    />
                                </View>
                        }



                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.username}>{auth.currentUser.displayName}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={styles.userStatus}>
                                <Text style={{ color: 'white' }}>{publishedBooks.length}</Text>
                                <Text style={{ color: 'white' }}>Tác phẩm</Text>
                            </View>
                            <View style={styles.userStatus}>
                                <Text style={{ color: 'white' }}>{books && books.length}</Text>
                                <Text style={{ color: 'white' }}>Danh sách đọc</Text>
                            </View>
                            <View style={styles.userStatus}>
                                <Text style={{ color: 'white' }}>{storeBooks && storeBooks.length}</Text>
                                <Text style={{ color: 'white' }}>Kho lưu trữ</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={styles.readingTitle}>Danh sách đọc</Text>

                <View style={styles.readingWrapper}>
                    {
                        books ?
                            books.length > 0 ?
                                books.map(book =>
                                    <TouchableOpacity
                                        key={book.id}
                                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}
                                        onPress={() => this.props.navigation.navigate('Library')}
                                    >
                                        <Image
                                            style={{ width: 40, height: 56, marginRight: 16 }}
                                            source={{ uri: `${book.data.imageUrl ? book.data.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                                        />
                                        <View>
                                            <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.87)' }}>{book.data.name}</Text>
                                            <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.54)' }}>{book.data.author}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                                :
                                <Text style={{ textAlign: 'center', color: 'rgba(0,0,0,0.54)' }}>Trống</Text>
                            : <ActivityIndicator size='large' />
                    }
                </View>

                {/* MODAL SETTINGS */}
                <AuthContext.Consumer>
                    {
                        ({ onSignOut }) => (
                            <View>
                                {/* SHOW SETTINGS MODAL */}
                                <Modal
                                    isVisible={this.state.showSettings}
                                    backdropOpacity={0}
                                    animationIn='slideInRight'
                                    animationOut='slideOutRight'
                                    onBackdropPress={() => this.setState({ showSettings: !this.state.showSettings })}
                                    onBackButtonPress={() => this.setState({ showSettings: !this.state.showSettings })}
                                    style={{
                                        margin: 0,
                                        position: 'absolute',
                                        top: 42,
                                        right: 16,
                                        backgroundColor: 'white',
                                        borderRadius: 10
                                    }}
                                >
                                    <View>
                                        <TouchableOpacity
                                            style={{
                                                padding: 16
                                            }}
                                            onPress={() => this.setState({
                                                showChangeUserInfo: !this.state.showChangeUserInfo,
                                                infoType: 'username'
                                            })}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16
                                                }}
                                            >Đổi tên người dùng</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{
                                                padding: 16
                                            }}
                                            onPress={async () => {
                                                try {
                                                    let typeAccount = await SecureStore.getItemAsync('typeAccount')
                                                    if (typeAccount === 'facebook') throw 'Không thể đổi trực tiếp mật khẩu tài khoản Facebook!'
                                                    if (typeAccount === 'google') throw 'Không thể đổi trực tiếp mật khẩu tài khoản Google!'

                                                    if (typeAccount === 'email') {
                                                        this.setState({
                                                            showChangeUserInfo: !this.state.showChangeUserInfo,
                                                            infoType: 'password'
                                                        })
                                                    }
                                                } catch (err) {
                                                    Toast.show(err)
                                                }
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16
                                                }}
                                            >Đổi mật khẩu</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                padding: 16
                                            }}
                                            onPress={async () => { this.setState({ showSettings: false }); await onSignOut() }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: 'red'
                                                }}
                                            >Đăng xuất</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* SHOW CHANGE USER INFO MODAL */}
                                    <Modal
                                        isVisible={this.state.showChangeUserInfo}
                                        onBackButtonPress={() => this.setState({ showChangeUserInfo: !this.state.showChangeUserInfo })}
                                        style={{
                                            flex: 1,
                                            margin: 0,
                                            position: 'absolute',
                                            backgroundColor: 'white',
                                            bottom: 0,
                                            width: widthScreen,
                                            borderTopLeftRadius: 8,
                                            borderTopRightRadius: 8,
                                            padding: 16
                                        }}
                                    >
                                        <View>
                                            {
                                                this.state.infoType === 'username' &&
                                                <View>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <TextInput
                                                            placeholder='Nhập tên người dùng mới...'
                                                            style={{
                                                                paddingVertical: 8
                                                            }}
                                                            value={username}
                                                            onChangeText={text => this.setUsername(text)}
                                                        />
                                                        <AwesomeButton
                                                            width={32}
                                                            height={32}
                                                            borderRadius={32}
                                                            backgroundColor={'rgba(244, 67, 54, 1)'}
                                                            progress
                                                            onPress={async (next) => {
                                                                try {
                                                                    await this.onUpdateUsername()
                                                                    Toast.show('Updated!')

                                                                } catch (err) {
                                                                    Toast.show(err)
                                                                }
                                                                next()
                                                            }}
                                                        >
                                                            <FontAwesome5
                                                                name={'check'}
                                                                size={20}
                                                                color='white'
                                                            />
                                                        </AwesomeButton>
                                                    </View>

                                                    <Text
                                                        style={{
                                                            color: 'gray',
                                                            fontSize: 12
                                                        }}
                                                    >Tên người dùng hiện tại: {auth.currentUser.displayName}</Text>
                                                </View>
                                            }

                                            {
                                                this.state.infoType === 'password' &&
                                                <View
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <TextInput
                                                            placeholder='Nhập mật khẩu hiện tại'
                                                            style={{
                                                                paddingVertical: 8,
                                                                flex: 1
                                                            }}
                                                            value={currentPassword}
                                                            onChangeText={t => this.setCurrentPassword(t)}
                                                            secureTextEntry={currentPasswordSecurity}
                                                        />
                                                        <Ionicons
                                                            name={currentPasswordSecurity ? 'md-eye' : 'md-eye-off'}
                                                            size={20}
                                                            color={currentPasswordSecurity ? 'gray' : 'lightgray'}
                                                            onPress={() => this.setCurrentPasswordSecurity(!currentPasswordSecurity)}
                                                            style={{
                                                                padding: 6,
                                                                borderRadius: 20
                                                            }}
                                                        />
                                                    </View>

                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <TextInput
                                                            placeholder='Nhập mật khẩu mới'
                                                            style={{
                                                                paddingVertical: 8,
                                                                flex: 1
                                                            }}
                                                            value={newPassword}
                                                            onChangeText={t => this.setNewPassword(t)}
                                                            secureTextEntry={newPasswordSecurity}
                                                        />
                                                        <Ionicons
                                                            name={newPasswordSecurity ? 'md-eye' : 'md-eye-off'}
                                                            size={20}
                                                            color={newPasswordSecurity ? 'gray' : 'lightgray'}
                                                            onPress={() => this.setNewPasswordSecurity(!newPasswordSecurity)}
                                                            style={{
                                                                padding: 6,
                                                                borderRadius: 20
                                                            }}
                                                        />
                                                    </View>

                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: 16
                                                        }}
                                                    >
                                                        <TextInput
                                                            placeholder='Nhập lại mật khẩu mới'
                                                            style={{
                                                                paddingVertical: 8,
                                                                flex: 1
                                                            }}
                                                            value={confirmNewPassword}
                                                            onChangeText={t => this.setConfirmNewPassword(t)}
                                                            secureTextEntry={confirmNewPasswordSecurity}
                                                        />
                                                        <Ionicons
                                                            name={confirmNewPasswordSecurity ? 'md-eye' : 'md-eye-off'}
                                                            size={20}
                                                            color={confirmNewPasswordSecurity ? 'gray' : 'lightgray'}
                                                            onPress={() => {
                                                                this.setConfirmNewPasswordSecurity(!confirmNewPasswordSecurity)
                                                            }}
                                                            style={{
                                                                padding: 6,
                                                                borderRadius: 20
                                                            }}
                                                        />
                                                    </View>


                                                    <AwesomeButton
                                                        backgroundColor={'rgba(244, 67, 54, 1)'}
                                                        stretch
                                                        progress
                                                        onPress={async (next) => {
                                                            try {
                                                                await this.onUpdatePassword()
                                                                Toast.show('Updated!')
                                                            }
                                                            catch (err) {
                                                                Toast.show(err)
                                                            }
                                                            next()
                                                        }}
                                                    >
                                                        <Text style={{ color: 'white' }}>ĐỔI</Text>
                                                    </AwesomeButton>
                                                </View>
                                            }
                                        </View>
                                    </Modal>
                                </Modal>
                            </View>

                        )
                    }
                </AuthContext.Consumer>
            </ScrollView>
        )
    }
}

User.contextType = ReadBookContext

const styles = StyleSheet.create({
    avatarWrapper: {
        paddingBottom: 25,
        backgroundColor: 'rgba(244, 67, 54, 1)',
    },
    avatar: {
        width: 130 / 360 * widthScreen,
        height: 130 / 360 * widthScreen,
        borderRadius: 130,
        alignSelf: 'center'
    },
    settingIcon: {
        width: 23,
        height: 23,
        alignSelf: 'flex-end',
        marginRight: 16,
        marginTop: 16
    },
    username: {
        fontSize: 24,
        color: 'white',
        marginTop: 17,
        paddingTop: 4,
        paddingBottom: 4
    },
    userTag: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        paddingTop: 2,
        paddingBottom: 3,
        marginBottom: 23
    },
    userStatus: {
        alignItems: 'center'
    },
    readingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16
    },
    readingWrapper: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        backgroundColor: 'white'
    }
})