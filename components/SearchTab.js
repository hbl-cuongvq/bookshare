import React, { Component } from 'react';
import {
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    ActivityIndicator,
    ScrollView
} from 'react-native'

import BookInfo from '../screens/BookInfo'

import RBSheet from "react-native-raw-bottom-sheet"

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { searchName } from '../api/book/searches/searchName'
import { searchAll } from '../api/book/searches/searchAll'
import { searchAuthor } from '../api/book/searches/searchAuthor'
import { searchCategory } from '../api/book/searches/searchCategory'
import { searchLibrary } from '../api/book/searches/searchLibrary'
import { searchTag } from '../api/book/searches/searchTag'
import { searchUserTag } from '../api/book/searches/searchUserTag'


import Tag from './Tag'
import Toast from 'react-native-simple-toast';

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

var filters = [
    {
        type: 'bookTitle',
        name: 'Tên truyện',
        symbor: '!',
        chosing: true,
    },
    {
        type: 'tag',
        name: 'Tag truyện',
        symbor: '#',
        chosing: false,
    },
    {
        type: 'author',
        name: 'Tác giả',
        symbor: '&',
        chosing: false,
    },
    {
        type: 'category',
        name: 'Thể loại',
        symbor: '$',
        chosing: false,
    },
    {
        type: 'tagUser',
        name: 'Tag người dùng',
        symbor: '@',
        chosing: false,
    },
    {
        type: 'none',
        name: 'None',
        symbor: '',
        chosing: false,
    }
]

const symborList = ['!', '@', '#', '$', '&', '%']

export default class SearchTab extends Component {
    constructor(props) {
        super(props)

        this.state = {
            textInput: '',
            filtersState: filters,
            result: null,
            isLoading: false,
        }

        this.textInputRef = React.createRef();
    }

    setIsLoading = isLoading => {
        this.setState({ isLoading })
    }

    onSearch = async (text) => {
        if (text.length > 1) {
            this.setIsLoading(true)
            let { filtersState } = this.state
            let filterChosing = filtersState.find(filter => filter.chosing === true)
            switch (filterChosing.type) {
                case 'bookTitle':
                    try {
                        await searchName(text, this.setResult, this.setIsLoading)
                    } catch (err) {
                        Toast.show(err)
                    }
                    break;
                case 'tag':
                    try {
                        await searchTag(text, this.setResult, this.setIsLoading)
                    } catch (err) {
                        Toast.show(err)
                    }
                    break;
                case 'author':
                    try {
                        await searchAuthor(text, this.setResult, this.setIsLoading)
                    } catch (err) {
                        Toast.show(err)
                    }
                    break;
                case 'category':
                    try {
                        await searchCategory(text, this.setResult, this.setIsLoading)
                    } catch (err) {
                        Toast.show(err)
                    }
                    break;
                case 'tagUser':
                    try {
                        await searchUserTag(text, this.setResult, this.setIsLoading)
                    } catch (err) {
                        Toast.show(err)
                    }
                    break;
                case 'none':
                    this.setIsLoading(false)
                    break;
            }
        }
    }

    UNSAFE_componentWillMount() {
        const { keyword } = this.props

        this.setState({
            textInput: keyword,
            typeSeach: {
                type: 'bookTitle',
                name: 'Tên truyện'
            }
        })
    }

    setResult = (result) => {
        this.setState({ result })
    }

    onChosingFilter(filterChosed) {
        filters.find(filter => filter === filterChosed).chosing = true
        filters.filter(filter => filter != filterChosed).forEach(f => f.chosing = false)

        this.setState({
            filtersState: filters,
            textInput: filterChosed.symbor,
            typeSeach: {
                type: filterChosed.type,
                name: filterChosed.name
            }
        })
    }

    onPressButton() {
        this.RBSheet.open()
        const { keyword } = this.props

        const symborChosing = keyword.charAt(0)

        const filterChosed = filters.find(filter => filter.symbor === symborChosing)
        filterChosed.chosing = true
        filters.filter(filter => filter != filterChosed).forEach(f => f.chosing = false)

        this.setState({
            textInput: keyword,
            filtersState: filters,
            typeSeach: {
                type: filterChosed.type,
                name: filterChosed.name
            },
            result: null
        })
    }

    onChangeInput(text) {

        this.setState({ textInput: text })
        const symborChosing = symborList.find(symbor => symbor === text.charAt(0)) ? text.charAt(0) : ''

        const filterChosed = filters.find(filter => filter.symbor === symborChosing)
        filterChosed.chosing = true
        filters.filter(filter => filter != filterChosed).forEach(f => f.chosing = false)

        this.setState({
            filtersState: filters,
            typeSeach: {
                type: filterChosed.type,
                name: filterChosed.name
            }
        })


    }

    render() {
        const {
            textInput,
            filtersState,
            typeSeach,
            result,
            isLoading
        } = this.state
        const { type, tag, color } = this.props

        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.onPressButton()
                    }}
                    style={type === 'icon' && styles.iconWrapper}
                >
                    {
                        type === 'icon' &&
                        <MaterialIcons name='search' size={32} color='rgba(244, 67, 54, 1)' />
                    }

                    {
                        type === 'tagButton' &&
                        <Tag tag={tag} color={color} />
                    }

                    {
                        type === 'categoryMore' &&
                        <View style={{
                            padding: 10,
                            backgroundColor: 'rgba(0,0,0,0.54)',
                            marginRight: 8,
                            borderRadius: 34,
                            width: 150,
                            marginVertical: 34,
                            height: 242,
                            marginRight: 32,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.moreText}>Thêm ...</Text>
                        </View>
                    }

                    {
                        type === 'library' &&
                        <MaterialIcons name='search' size={32} style={{ marginRight: 16 }} />
                    }
                </TouchableOpacity>


                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={heightScreen}
                    openDuration={300}
                    customStyles={{
                        container: {
                            backgroundColor: '#FAFAFA'
                        }
                    }}
                >
                    {/* Content here */}
                    <ScrollView
                        style={{ paddingHorizontal: 16 }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* SEARCH BAR */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1
                        }}>
                            <TouchableOpacity onPress={() => this.RBSheet.close()}>
                                <AntDesign
                                    name='arrowleft'
                                    size={22}
                                    style={{
                                        marginRight: 8,
                                        color: 'rgba(0,0,0,0.54)'
                                    }}
                                />
                            </TouchableOpacity>

                            <View style={styles.container}>
                                <TextInput
                                    ref={this.textInputRef}
                                    autoFocus={true}
                                    style={styles.input}
                                    placeholder='Nhập từ khoá ...'
                                    placeholderTextColor='rgba(0, 0, 0, 0.38)'
                                    onChangeText={text => this.onChangeInput(text)}
                                    value={textInput}
                                />

                                <TouchableOpacity
                                    onPress={() => {
                                        this.onSearch(textInput)
                                    }}
                                >
                                    <Ionicons
                                        name='md-search'
                                        size={32}
                                        style={styles.iconSearch}
                                    />
                                </TouchableOpacity>

                            </View>
                        </View>

                        {/* FILTER */}
                        <Text
                            style={styles.filterTitle}
                        >Tìm kiếm theo</Text>
                        <FlatList
                            data={filtersState}
                            renderItem={({ item }) => {
                                if (item.type !== 'none')
                                    return (
                                        <TouchableOpacity
                                            style={item.chosing ? styles.filterChosing : styles.filter}
                                            onPress={() => {
                                                this.setResult(null)
                                                this.onChosingFilter(item)
                                            }}
                                        >
                                            <Text style={item.chosing ? styles.filterChosingText : {}}>{item.symbor}{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                            }
                            }
                            keyExtractor={(item) => item.type}
                            numColumns={widthScreen > 360 ? 4 : 3}
                        />


                        {/* RESULT SEARCH */}
                        <Text
                            style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.87)', fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}
                        >{typeSeach.name}</Text>
                        {
                            textInput !== '' ?
                                isLoading ?
                                    <ActivityIndicator size='large' />
                                    :
                                    result ?
                                        result.length > 0 ?
                                            <View
                                                style={{
                                                    marginTop: 8
                                                }}
                                            >
                                                {
                                                    result.map(item => (
                                                        <BookInfo
                                                            key={item.id}
                                                            bookInfo={item.data}
                                                            bookId={item.id}
                                                            touchType='search'
                                                            searchType={filters.find(f => f.chosing === true).type}
                                                            {...this.props}
                                                            RBSheet={this.RBSheet}
                                                            searchWord={textInput}
                                                        />
                                                    ))
                                                }
                                            </View>
                                            :
                                            <Text style={{ alignSelf: 'center', color: 'rgba(0,0,0,0.37)', marginTop: 16 }}>Không tìm thấy...</Text>
                                        :
                                        <Text style={{ alignSelf: 'center', color: 'rgba(0,0,0,0.37)', marginTop: 16 }}>Dữ liệu trống...</Text>
                                :
                                <Text style={{ alignSelf: 'center', color: 'rgba(0,0,0,0.37)', marginTop: 16 }}>Chọn phương thức tìm kiếm...</Text>
                        }
                    </ScrollView>
                </RBSheet>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#00000014',
        flexDirection: 'row',
        marginTop: 24,
        borderRadius: 50,
        marginBottom: 28,
        flex: 1
    },
    iconWrapper: {
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 50,
        elevation: 10
    },
    icon: {
        width: 24,
        height: 24,
    },
    iconSearch: {
        marginRight: 17,
        marginTop: 12,
        marginBottom: 11,
        color: 'rgba(0,0,0,0.54)'
    },
    searchBarText: {
        color: '#00000061',
        width: 242 / 360 * widthScreen,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    input: {
        color: 'rgba(0, 0, 0, 0.87)',
        marginLeft: 17,
        flex: 1
    },
    tagButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 20,
        marginRight: 9,
    },
    textTagButton: {
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 14,
        paddingRight: 14,
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: 14,
        fontWeight: 'bold'
    },
    more: {
        width: 85 / 360 * widthScreen,
        height: 119 / 640 * heightScreen,
        backgroundColor: 'rgba(0,0,0,0.24)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'
    },
    moreText: {
        color: 'white',
        fontSize: 18
    },
    filter: {
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        marginRight: 10,
        marginBottom: 10
    },
    filterTitle: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
    },
    filterChosing: {
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 20,
        backgroundColor: 'rgba(24, 115, 194, 1)',

        marginRight: 10,
        marginBottom: 10
    },
    filterChosingText: {
        color: 'white',
    }
})