import React, { Component } from 'react';
import { values } from 'lodash';
import { USER_CONNECTED, USER_DISCONNECTED, PRIVATE_MESSAGE, COMMUNITY_CHAT } from './Events';
import SideBar from './SideBar/SideBar';

export default class ChatContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chats: [],
      activeChat: null,
      users: []
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
    // socket.on(PRIVATE_MESSAGE, this.addChat)
    // socket.on('connect', () => {
    //   socket.emit(COMMUNITY_CHAT, this.resetChat)
    // })
    socket.on(USER_CONNECTED, (users) => {
      this.setState({ users: values(users) })
    })
    // socket.on(USER_DISCONNECTED, (users) => {
    //   this.setState({ users: values(users) })
    // })
  }

  /*
  * Reset the chat back to only the chat passed in.
  * @param chat { Chat }
  */
  resetChat = (chat) => {
    return this.addChat(chat, true)
  }

  render() {
    const { user, logout } = this.props
    const { activeChat, chats, users } = this.state
    return (
      <div className="container">
        <SideBar
          logout={logout}
          chats={chats}
          user={user}
          users={users}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
          onSendPrivateMessage={this.sendOpenPrivateMessage}
        />
      </div>
    )
  }
}