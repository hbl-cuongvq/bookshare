import React, { Component } from 'react'

import {
    View,
    Text,
    Dimensions,
    FlatList,
    TextInput,
    TouchableOpacity
} from 'react-native'

import { AddBookContext } from '../../../contexts/AddBook'

import AwesomeButton from 'react-native-really-awesome-button'

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

import { getCategories } from '../../../api/book/getCategories'

import DropDownPicker from 'react-native-dropdown-picker'

export default class CategoriesAndTags extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categoriesDefault: [],
        }
    }

    async componentDidMount() {
        const categories = await getCategories()
        console.log(categories)

        if (categories.length > 0) {
            this.setState({
                categoriesDefault: categories
            })
        }
    }

    render() {
        const { categoriesDefault } = this.state
        console.log(categoriesDefault)
        return (
            <AddBookContext.Consumer>
                {({ tags,
                    categories,
                    addTag,
                    tagText,
                    setTagText,
                    selectedBook,
                    setCategories,
                    setSelectedCategories,
                    updateCategoriesAndTags,
                    deleteTag,
                    deleteCategory,
                    author, 
                    setAuthor,
                    updateAuthor,
                    selectedBookId
                }) => {
                    console.log(categories)
                    return (
                        <View
                            style={{
                                backgroundColor: 'white',
                                flex: 1,
                                padding: 16,
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                {/* CATEGORIES */}
                                {
                                    <DropDownPicker
                                        items={categoriesDefault}
                                        // defaultValue={[1]}
                                        style={{ backgroundColor: 'white' }}
                                        dropDownStyle={{ backgroundColor: 'white' }}
                                        onChangeItem={items => {
                                            setCategories(items)
                                        }}
                                        multiple={true}
                                        multipleText="Đã chọn %d thể loại"
                                        placeholder="Thể loại truyện"
                                        labelStyle={{ fontSize: 18, color: 'rgba(0,0,0,0.87)' }}
                                        containerStyle={{ height: 56, marginBottom: 16 }}
                                        dropDownMaxHeight={250}
                                    />
                                }
                                {
                                    categories &&
                                    <FlatList
                                        data={categories && categories}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 16,
                                                    marginRight: 8,
                                                    marginBottom: 8,
                                                    borderRadius: 20,
                                                    backgroundColor: 'rgba(0,0,0,0.08)'
                                                }}
                                                onLongPress={() => {
                                                    deleteCategory(item)
                                                }}
                                            >
                                                <Text>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item) => item}
                                        style={{ flexGrow: 0 }}
                                        numColumns={3}
                                    />
                                }



                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 16,
                                        marginTop: 24
                                    }}
                                >
                                    <TextInput
                                        style={{
                                            margin: 0,
                                            padding: 8,
                                            borderBottomWidth: 1,
                                            borderBottomColor: 'rgba(0,0,0,0.16)',
                                            width: 288 / 360 * widthScreen
                                        }}
                                        placeholder='Thêm tag truyện...'
                                        value={tagText}
                                        onChangeText={text => setTagText(text)}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: 'dodgerblue',
                                            borderRadius: 32,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        onPress={() => {
                                            addTag(tagText)
                                            setTagText('')
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 32,
                                            color: 'white'
                                        }}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                {
                                    tags &&
                                    <FlatList
                                        data={tags && tags}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 16,
                                                    marginRight: 8,
                                                    marginBottom: 8,
                                                    borderRadius: 20,
                                                    backgroundColor: 'rgba(0,0,0,0.08)'
                                                }}
                                                onLongPress={() => {
                                                    deleteTag(item)
                                                }}
                                            >
                                                <Text>#{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item) => item}
                                        style={{ flexGrow: 0 }}
                                        numColumns={3}
                                    />
                                }

                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: 'rgba(0,0,0,0.32)',
                                        textAlign: 'center'
                                    }}
                                >(Nhấn giữ để xoá)</Text>

                                <TextInput
                                    style={{
                                        margin: 0,
                                        padding: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'rgba(0,0,0,0.16)',
                                        width: 288 / 360 * widthScreen
                                    }}
                                    placeholder='Tác giả'
                                    value={author}
                                    onChangeText={text => setAuthor(text)}
                                />
                            </View>

                            <AwesomeButton
                                stretch={true}
                                backgroundColor={'rgba(244, 67, 54, 1)'}
                                progress={true}
                                onPress={async (next) => {
                                    await updateCategoriesAndTags(categories, tags)
                                    await updateAuthor(author, selectedBookId)
                                    this.props.navigation.goBack()
                                    next()
                                }}
                            >
                                <Text style={{ color: 'white' }}>LƯU</Text>
                            </AwesomeButton>
                        </View>
                    )
                }}
            </AddBookContext.Consumer>

        )
    }
}