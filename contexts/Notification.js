import React, { Component } from 'react'

import Toast from 'react-native-simple-toast'

import {
    addMessage,
    deleteMessage,
    getAllMessage,
    setSeen
} from '../api/user/notification/notificationApi'

export const NotificationContext = React.createContext()

export class NotificationProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: []
        }
    }

    setMessages = messages => this.setState({ messages })

    async componentDidMount() {
        try {
            await getAllMessage(this.setMessages)
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        return (
            <NotificationContext.Provider
                value={{
                    addMessage: addMessage,
                    deleteMessage: deleteMessage,
                    messages: this.state.messages,
                    setSeen: setSeen
                }}
            >
                {this.props.children}
            </NotificationContext.Provider>
        )
    }
}