import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

export default class Tag extends Component {
    constructor(props) {
        super(props)

        this.state = {
            colorOnce: null
        }

        this.setColorOnce = this.setColorOnce.bind(this)
    }

    setColorOnce = colorOnce => this.setState({colorOnce})

    UNSAFE_componentWillReceiveProps() {
        const {colorOnce} = this.state
        const { color } = this.props
        if (colorOnce === null) {
            this.setColorOnce(color)
        }
    }

    componentDidMount() {
        const {colorOnce} = this.state
        const { color } = this.props
        if (colorOnce === null) {
            this.setColorOnce(color)
        }
    }

    render() { 
        const { tag, color } = this.props
        const {colorOnce} = this.state

        return (
            <View
                key={tag} style={[styles.tagButton, {
                    backgroundColor: colorOnce ? colorOnce : 'transparent',
                }]}
            >
                <Text style={styles.textTagButton}>#{tag}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tagButton: {
        borderRadius: 20,
        marginRight: 9,
    },
    textTagButton: {
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 14,
        paddingRight: 14,
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    }
})