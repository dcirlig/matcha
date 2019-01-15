import React, { Component } from 'react';
import SideBar from '../Sidebar/SideBar'
import { COMMUNITY_CHAT, MESSAGE_RECEIVED, TYPING, MESSAGE_SENT, PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONNECTED } from '../Events'
import Messages from '../Messages/Messages'
import MessageInput from '../Messages/MessageInput'
import ChatHeading from './ChatHeading'
import { values } from 'lodash'

export default class ChatContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chats: [],
      activeChat: null,
      users: [{ id: 4, name: 'delphine' }]
    }
  }

  componentDidMount() {
    const { socket } = this.props
    this.initSocket(socket)
  }

  componentWillUnmount() {
    const { socket } = this.props
    socket.off(PRIVATE_MESSAGE)
    socket.off(USER_CONNECTED)
    socket.off(USER_DISCONNECTED)
  }

  initSocket = (socket) => {
    socket.emit(COMMUNITY_CHAT, this.resetChat)
    socket.on(PRIVATE_MESSAGE, this.addChat)
    socket.on('connect', () => {
      socket.emit(COMMUNITY_CHAT, this.resetChat)
    })
    socket.on(USER_CONNECTED, (users) => {
      this.setState({ users: values(users) })
    })
    socket.on(USER_DISCONNECTED, (users) => {
      this.setState({ users: values(users) })
    })
  }

  sendOpenPrivateMessage = (receiver) => {
    const { socket, user } = this.props
    socket.emit(PRIVATE_MESSAGE, { receiver, sender: user.name })
  }

  /*
  * Reset the chat back to only the chat passed in.
  * @param chat { Chat }
  */
  resetChat = (chat) => {
    return this.addChat(chat, true)
  }

  /* Adds chat to the chat container, if reset is true removes all chats
  * and sets that chat to the main chat.
  * Sets the message and typing socket events for the chat.
  *  @param chat { Chat } the chat to be added.
  * @param reset { boolean } if true will set the chat as the only chat.
  */
  addChat = (chat, reset) => {
    const { socket } = this.props
    const { chats } = this.state

    let test = chats.map(existingChat => {
      if (existingChat.name === chat.name)
        return 1
      return 0
    })

    if (!(test.includes(1))) {
      const newChats = reset ? [chat] : [...chats, chat]
      this.setState({ chats: newChats, activeChat: reset ? chat : this.state.activeChat })

      const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`
      const typingEvent = `${TYPING}-${chat.id}`

      socket.on(typingEvent, this.updateTypingInChat(chat.id))
      socket.on(messageEvent, this.addMessageToChat(chat.id))
    }
  }

  /* 
  * Returns a function that
  * adds message to chat with the chatId passed in.
  * 
  * @param chatId { number }
  */
  addMessageToChat = (chatId) => {
    return message => {
      const { chats } = this.state
      let newChats = chats.map((chat) => {
        if (chat.id === chatId)
          chat.messages.push(message)
        return chat
      })
      this.setState({ chats: newChats })
    }
  }

  /* 
  * Updates the typing of chat with id passed in.
  * @param chatId { number }
  */
  updateTypingInChat = (chatId) => {
    return ({ isTyping, user }) => {
      if (user !== this.props.user.name) {
        const { chats } = this.state
        let newChats = chats.map((chat) => {
          if (chat.id === chatId) {
            if (isTyping && !chat.typingUsers.includes(user)) {
              chat.typingUsers.push(user)
            } else if (!isTyping && chat.typingUsers.includes(user)) {
              chat.typingUsers = chat.typingUsers.filter(u => u !== user)
            }
          }
          return chat
        })
        this.setState({ chat: newChats })
      }
    }
  }

  /* 
  * Adds a message to the specified chat
  * @param chatId {number} The id of the chat to be added to.
  * @param message {string} The message to be added to the chat.
  */
  sendMessage = (chatId, message) => {
    const { socket } = this.props
    socket.emit(MESSAGE_SENT, { chatId, message })
  }

  /* 
  * Send typing status to server.
  * chatId {number} the id of the chat being typed in.
  * typing {boolean} if the user is typing still or not.
  */
  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props
    socket.emit(TYPING, { chatId, isTyping })
  }

  setActiveChat = (activeChat) => {
    this.setState({ activeChat })
  }

  render() {
    const { user, logout } = this.props
    const { activeChat, chats, users } = this.state
    return (
      <div className="global-chat-container">
        <SideBar
          logout={logout}
          chats={chats}
          user={user}
          users={users}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
          onSendPrivateMessage={this.sendOpenPrivateMessage}
        />
        <div className="chat-room-container">
          {
            activeChat !== null ? (
              <div className="chat-room">
                <ChatHeading name={activeChat.name} />
                <Messages
                  messages={activeChat.messages}
                  user={user}
                  typingUsers={activeChat.typingUsers}
                />
                <MessageInput
                  sendMessage={
                    (message) => {
                      this.sendMessage(activeChat.id, message)
                    }
                  }
                  sendTyping={
                    (isTyping) => { this.sendTyping(activeChat.id, isTyping) }
                  }
                />
              </div>
            ) :
              <div className="chat-room choose">
                <h3>Choose a chat!</h3>
              </div>
          }
        </div>
      </div>
    )
  }
}