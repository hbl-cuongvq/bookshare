import React from "react"

import { auth } from '../api/DBConfig'

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Text,
    Image,
    Dimensions
} from "react-native";

import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

import { AddBookContext } from '../contexts/AddBook'

import Modal from 'react-native-modal';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

import { getLastEditedBook } from '../api/book/getLastEditedBook'
import Toast from "react-native-simple-toast";


export default class AddButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            lastEditedBook: null
        }

        this.setLastEditedBook = this.setLastEditedBook.bind(this)
    }

    setLastEditedBook = book => {
        this.setState({
            lastEditedBook: book
        })
    }

    mode = new Animated.Value(0);
    buttonSize = new Animated.Value(1);

    handlePress = () => {
        Animated.sequence([
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                duration: 300
            })
        ]).start();
    };

    modalAction = async () => {
        this.handlePress()
        this.setState({ visible: !this.state.visible })
        console.log(this.state.visible)
        if (!this.state.visible) {
            try {
                let { uid } = auth.currentUser
                await getLastEditedBook(uid, this.setLastEditedBook)
            } catch (err) {
                Toast.show(err)
            }
        }
    }

    render() {
        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "45deg"]
        })

        const { lastEditedBook } = this.state

        return (
            <View style={{ position: "absolute", alignItems: "center" }}>
                <Modal
                    isVisible={this.state.visible}
                    backdropOpacity={0.3}
                    onBackButtonPress={this.modalAction}
                    onBackdropPress={this.modalAction}
                    style={{
                        flex: 1,
                        position: 'absolute',
                        margin: 0,
                        bottom: 90,
                        alignSelf: 'center',
                        width: widthScreen - 24 * 2
                    }}
                >
                    <View style={styles.modal}>
                        {/* CONTENT MODAL*/}
                        {
                            lastEditedBook &&
                            <View
                                style={{
                                    paddingBottom: 16,
                                    marginBottom: 24,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'rgba(0,0,0,0.54)',
                                    alignItems: 'stretch',
                                    marginRight: 16,
                                    flexDirection: 'row'
                                }}
                            >
                                <Image
                                    style={{
                                        width: 50,
                                        height: 70
                                    }}
                                    source={{ uri: `${lastEditedBook.data.imageUrl ? lastEditedBook.data.imageUrl : 'https://via.placeholder.com/160x224.png/?text=No+Image'}` }}
                                />

                                <View style={{
                                    marginLeft: 19,
                                    justifyContent: 'space-between'
                                }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontWeight: 'bold'
                                        }}
                                    >{lastEditedBook.data.name}</Text>

                                    <AddBookContext.Consumer>
                                        {
                                            ({
                                                setSelectedBook,
                                                setName,
                                                setDescription,
                                                setImageUrl,
                                                setImage,
                                                imageUrl,
                                                setCategories,
                                                setTag,
                                                setAuthor
                                            }) => (
                                                    <TouchableOpacity
                                                        style={{
                                                            padding: 8,
                                                            paddingLeft: 16,
                                                            paddingRight: 16,
                                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                            borderRadius: 20
                                                        }}

                                                        onPress={() => {
                                                            setSelectedBook(lastEditedBook.id, lastEditedBook.data)
                                                            setName(lastEditedBook.data.name)
                                                            setDescription(lastEditedBook.data.description)
                                                            setImageUrl(lastEditedBook.data.imageUrl)
                                                            setCategories(lastEditedBook.data.categories ? lastEditedBook.data.categories : [])
                                                            setTag(lastEditedBook.data.tags ? lastEditedBook.data.tags : [])
                                                            setAuthor(lastEditedBook.data.author)
                                                            if (imageUrl) setImage(null)

                                                            this.setState({ visible: !this.state.visible })
                                                            this.handlePress()
                                                            setTimeout(() => {
                                                                this.props.navigation.navigate('AddBook', { screen: 'AddChapterInfo' })
                                                            }, 260)

                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 12,
                                                                color: 'rgba(0, 0, 0, 0.54)'
                                                            }}
                                                        >Tiếp tục viết</Text>
                                                    </TouchableOpacity>
                                                )
                                        }
                                    </AddBookContext.Consumer>

                                </View>

                            </View>
                        }

                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => {
                                this.setState({ visible: !this.state.visible })
                                this.handlePress()
                                setTimeout(() => {
                                    this.props.navigation.navigate('AddBook', { screen: 'EditBook' })
                                }, 260)
                            }}
                        >
                            <FontAwesome5 name='pen' size={18} color='rgba(0, 0, 0, 0.54)' />
                            <Text style={styles.modalText}>Chỉnh sửa truyện</Text>
                        </TouchableOpacity>

                        <AddBookContext.Consumer>
                            {
                                ({ setDefault }) =>
                                    <TouchableOpacity style={{ flexDirection: 'row' }}
                                        onPress={() => {
                                            this.setState({ visible: !this.state.visible })
                                            this.handlePress()
                                            setDefault()
                                            setTimeout(() => {
                                                this.props.navigation.navigate('AddBook', { screen: 'AddBookInfo' })
                                            }, 260)
                                        }}
                                    >
                                        <FontAwesome5 name='book-open' size={18} color='rgba(0, 0, 0, 0.54)' />
                                        <Text style={[styles.modalText, {marginBottom: 0}]}>Viết truyện mới</Text>
                                    </TouchableOpacity>
                            }
                        </AddBookContext.Consumer>


                        <FontAwesome
                            name='caret-down'
                            size={32}
                            style={{
                                position: 'absolute',
                                bottom: -20,
                                alignSelf: 'center',
                                color: 'white'
                            }}
                        />
                    </View>
                </Modal>

                <AnimatedTouchable activeOpacity={1} style={styles.button} onPress={this.modalAction} underlayColor="rgba(244, 67, 54, 0.5)">
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <Feather name="plus-circle" size={65} color={this.state.visible ? 'rgba(244, 67, 54, 1)' : 'rgba(0,0,0,0.54)'} />
                    </Animated.View>
                </AnimatedTouchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "white",
        position: "absolute",
        marginTop: -48,
        borderWidth: 3,
        borderColor: "#FFFFFF",
        elevation: 5
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 15,
        paddingHorizontal: 16,
        paddingVertical: 20,
        margin: 0
    },
    modalText: {
        color: 'rgba(0, 0, 0, 0.54)',
        marginLeft: 16,
        fontSize: 16,
        marginBottom: 20
    }
});