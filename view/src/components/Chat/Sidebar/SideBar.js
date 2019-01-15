import React, { Component } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { GoListUnordered } from 'react-icons/go'
import { FaSearch } from 'react-icons/fa'
import { MdEject } from 'react-icons/md'
import SideBarOption from './SideBarOption'
import { get, last, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../Factories'

export default class SideBar extends Component {
  static type = {
    CHATS: "chats",
    USERS: "users"
  }
  constructor(props) {
    super(props)
    this.state = {
      receiver: "",
      activeSideBar: SideBar.type.CHATS
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { receiver } = this.state
    const { onSendPrivateMessage } = this.props

    onSendPrivateMessage(receiver)
    this.setState({ receiver: "" })
  }

  addChatForUser = (username) => {
    this.setActiveSideBar(SideBar.type.CHATS)
    this.props.onSendPrivateMessage(username)
  }
  setActiveSideBar = (newSideBar) => {
    this.setState({ activeSideBar: newSideBar })
  }

  render() {
    const { chats, activeChat, user, setActiveChat, logout, users } = this.props
    console.log(users)
    const { receiver, activeSideBar } = this.state
    return (
      <div id="side-bar">
        <div className="heading">
          <div className="app-name">Your community<IoIosArrowDown /></div>
          <div className="menu">
            <GoListUnordered />
          </div>
        </div>
        <form onSubmit={this.handleSubmit} className="search">
          <i className="search-icon"><FaSearch /></i>
          <input placeholder="Search" type="text" value={receiver} onChange={(e) => { this.setState({ receiver: e.target.value }) }} />
        </form>
        <div className="side-bar-select">
          <div
            onClick={() => { this.setActiveSideBar(SideBar.type.CHATS) }}
            className={`side-bar-select__option ${(activeSideBar === SideBar.type.CHATS) ? 'active' : ''}`}>
            <span>Messages</span>
          </div>
          <div
            onClick={() => { this.setActiveSideBar(SideBar.type.USERS) }}
            className={`side-bar-select__option ${(activeSideBar === SideBar.type.USERS) ? 'active' : ''}`}>
            <span>Matches</span>
          </div>
        </div>
        <div
          className="users"
          ref='users'
          onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null) }}
        >
          {
            activeSideBar === SideBar.type.CHATS ?
              chats.map((chat) => {
                if (chat.name) {
                  return (
                    <SideBarOption
                      key={chat.id}
                      name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name)}
                      lastMessage={get(last(chat.messages), 'message', '')}
                      active={activeChat.id === chat.id}
                      onClick={() => { this.props.setActiveChat(chat) }}
                    />
                  )
                }
                return null
              })
              :
              differenceBy(users, [user], 'name').map((otherUser) => {
                return (
                  <SideBarOption
                    key={otherUser.id}
                    name={otherUser.name}
                    onClick={() => { this.addChatForUser(otherUser.name) }}
                  />
                )
              })
          }
        </div>
        <div className="current-user">
          <span>{user.name}</span>
          <div onClick={() => { logout() }} title="Logout" className="logout">
            <MdEject />
          </div>
        </div>
      </div >
    )
  }
}