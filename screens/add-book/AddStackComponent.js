import React, { Component } from 'react'

import {
    Text,
    View,
    Keyboard,
    Dimensions,
    TouchableOpacity,
    Easing
} from 'react-native'

import Modal from 'react-native-modal'

import { AddBookContext } from '../../contexts/AddBook'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack'

import EditBook from './EditBook'
import AddBookInfo from './AddBookInfo'
import AddChapterInfo from './AddChapterInfo'
import CategoriesAndTags from './edit-book/CategoriesAndTags'

import AwesomeButton from 'react-native-really-awesome-button'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

const AddStack = createStackNavigator()

const AddChapterInfoModified = () => (
    <AddBookContext.Consumer>
        {({ selectedBookId }) => <AddChapterInfo bookId={selectedBookId} />}
    </AddBookContext.Consumer>
)

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 50,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const closeConfig = {
    animation: 'timing',
    config: {
        duration: 200,
        easing: Easing.linear
    }
}

export default class AddStackComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            publishModalVisible: false
        }
    }

    render() {
        return (
            <AddStack.Navigator
                headerMode='float'
                screenOptions={({ route }) => ({
                    ...TransitionPresets.SlideFromRightIOS,

                    transitionSpec: {
                        open: config,
                        close: closeConfig
                    },
                    headerTitle: () => {
                        switch (route.name) {
                            case 'CategoriesAndTags':
                                return <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }}
                                >Tác giả, thể loại và tag truyện</Text>
                                break;
                            case 'AddBookInfo':
                                return <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }}>Thông tin truyện</Text>
                                break;
                            case 'AddChapterInfo':
                                return <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }}>Chương truyện</Text>
                                break;
                        }
                    },
                    headerLeft: () => {
                        return <Ionicons
                            name='md-arrow-back'
                            size={24}
                            color='rgba(0, 0, 0, 0.87)'
                            style={{
                                marginLeft: widthScreen > 720 ? 0 : 16
                            }}

                            onPress={() => {
                                switch (route.name) {
                                    case 'EditBook':
                                        return this.props.navigation.goBack()
                                        break;
                                    case 'AddBookInfo':
                                        return this.props.navigation.navigate('EditBook')
                                        break;
                                    case 'AddChapterInfo':
                                        return this.props.navigation.navigate('AddBookInfo')
                                        break;
                                }
                            }}
                        />
                    },
                    headerRight: () => {
                        switch (route.name) {
                            case 'EditBook':
                                return (
                                    <AddBookContext.Consumer>
                                        {({ setDefault }) =>
                                            <Entypo
                                                name='plus'
                                                size={28}
                                                color='rgba(0, 0, 0, 0.87)'
                                                style={{ marginRight: 16 }}
                                                onPress={() => { setDefault(); this.props.navigation.navigate('AddBookInfo') }}
                                            />}
                                    </AddBookContext.Consumer>
                                )
                                break;
                            case 'EditBook':
                                return (
                                    <AddBookContext.Consumer>
                                        {({ setDefault }) =>
                                            <Entypo
                                                name='plus'
                                                size={28}
                                                color='rgba(0, 0, 0, 0.87)'
                                                style={{ marginRight: 16 }}
                                                onPress={() => { setDefault(); this.props.navigation.navigate('AddBookInfo') }}
                                            />}
                                    </AddBookContext.Consumer>
                                )
                                break;
                            case 'AddBookInfo':
                                return (
                                    <AddBookContext.Consumer>
                                        {
                                            ({ saveBook, selectedBookId }) =>
                                                <View
                                                    style={{ flexDirection: 'row' }}
                                                >

                                                    <AwesomeButton
                                                        backgroundColor={'rgba(244, 67, 54, 1)'}
                                                        height={32}
                                                        width={selectedBookId ? 64 : 54}
                                                        progress={true}
                                                        onPress={async (next) => {
                                                            Keyboard.dismiss()
                                                            let saved = await saveBook()
                                                            if (saved) next()
                                                            else next()
                                                        }}
                                                        style={{ marginRight: 16 }}
                                                    >
                                                        <Text style={{ color: 'white' }}>{selectedBookId ? 'Cập nhật' : 'Tạo'}</Text>
                                                    </AwesomeButton>

                                                    {
                                                        selectedBookId &&
                                                        <AddBookContext.Consumer>
                                                            {
                                                                ({ setDefaultCategoriesAndTags }) => (
                                                                    <Ionicons
                                                                        name='md-arrow-forward'
                                                                        size={24}
                                                                        color='rgba(0, 0, 0, 0.87)'
                                                                        style={{
                                                                            alignSelf: 'center',
                                                                            marginRight: widthScreen > 360 ? 24 : 16
                                                                        }}
                                                                        onPress={() => {
                                                                            setDefaultCategoriesAndTags()
                                                                            this.props.navigation.navigate('AddChapterInfo')
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                        </AddBookContext.Consumer>

                                                    }
                                                </View>
                                        }
                                    </AddBookContext.Consumer>
                                )
                                break;
                            case 'AddChapterInfo':
                                return (
                                    <AddBookContext.Consumer>
                                        {({
                                            selectedBook,
                                            selectedBookId,
                                            unPublishBook,
                                            publishBook
                                        }) => (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <View>
                                                        {
                                                            selectedBookId && selectedBook.publish ?
                                                                <AwesomeButton
                                                                    backgroundColor='rgba(244, 67, 54, 1)'
                                                                    height={32}
                                                                    width={80}
                                                                    progress={true}
                                                                    onPress={async (next) => {
                                                                        unPublishBook(selectedBookId)
                                                                        next()
                                                                    }}
                                                                >
                                                                    <Text style={{ color: 'white' }}>Bỏ xuất bản</Text>
                                                                </AwesomeButton>
                                                                :
                                                                <AwesomeButton
                                                                    backgroundColor='rgba(244, 67, 54, 1)'
                                                                    height={32}
                                                                    width={64}
                                                                    onPress={async (next) => {
                                                                        await publishBook()
                                                                        this.props.navigation.navigate('EditBook', {screen: 'Đã đăng'})
                                                                        next()
                                                                    }}
                                                                    progress={true}
                                                                >
                                                                    <Text style={{ color: 'white' }}>Xuất bản</Text>
                                                                </AwesomeButton>
                                                        }
                                                    </View>


                                                    <View>
                                                        {/* MENU CHAPTER BUTTON */}
                                                        <Entypo
                                                            name='dots-three-vertical'
                                                            size={24}
                                                            color='rgba(0, 0, 0, 0.87)'
                                                            style={{
                                                                marginRight: 12,
                                                                marginLeft: 10
                                                            }}
                                                            onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}
                                                        />
                                                        {/* MODAL MENU*/}

                                                        <Modal
                                                            isVisible={this.state.modalVisible}
                                                            backdropOpacity={0}
                                                            onBackdropPress={() => this.setState({ modalVisible: !this.state.modalVisible })}
                                                            onBackButtonPress={() => this.setState({ modalVisible: !this.state.modalVisible })}
                                                            animationIn='fadeInRightBig'
                                                            animationOut='fadeOutRightBig'
                                                        >
                                                            <View
                                                                style={{
                                                                    backgroundColor: 'white',
                                                                    elevation: 5,
                                                                    width: 200 / 360 * widthScreen,
                                                                    marginTop: heightScreen > 640 ? -476 / 640 * heightScreen : -446 / 640 * heightScreen,
                                                                    marginLeft: widthScreen > 360 ? 126 / 360 * widthScreen : 120 / 360 * widthScreen,
                                                                    borderRadius: 10
                                                                }}
                                                            >
                                                                <TouchableOpacity
                                                                    style={{
                                                                        padding: 16,
                                                                        paddingTop: 10,
                                                                        paddingBottom: 10
                                                                    }}
                                                                >
                                                                    <Text>Lưu</Text>
                                                                </TouchableOpacity>

                                                                <TouchableOpacity
                                                                    style={{
                                                                        padding: 16,
                                                                        paddingTop: 10,
                                                                        paddingBottom: 10
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{ color: 'red' }}
                                                                    >Xoá toàn bộ chương</Text>
                                                                </TouchableOpacity>
                                                            </View>

                                                        </Modal>
                                                    </View>

                                                </View>
                                            )
                                        }
                                    </AddBookContext.Consumer>
                                )
                                break;
                        }
                    }
                })}
            >
                <AddStack.Screen name='EditBook' component={EditBook} />
                <AddStack.Screen name='AddBookInfo' component={AddBookInfo} />
                <AddStack.Screen name='AddChapterInfo' component={AddChapterInfoModified} />
                <AddStack.Screen name='CategoriesAndTags' component={CategoriesAndTags} />
            </AddStack.Navigator>
        )
    }
}