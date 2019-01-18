import React, { Component } from "react";
import axios from "axios";
import { MDBRow, MDBCol, MDBBtn } from "mdbreact";
import Header from "../Navigation/Navigation";
import ChatContainer from "./ChatContainer";
import { Helmet } from "react-helmet";
import { ChatList } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';

export default class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      usersMatched: [],
      existingConv: [],
      activeConv: "",
      socket: this.props.socket,
      messages: [],
      display: 'messages'
    }
    this.newChat = this.newChat.bind(this)
    this.openChat = this.openChat.bind(this)
    this.openMatches = this.openMatches.bind(this)
    this.openMessages = this.openMessages.bind(this)
  }

  componentDidMount() {
    const socket = this.props.socket
    axios
      .post(`/api/chat/getRooms`, sessionStorage)
      .then(res => {
        if (res.data.success) {
          res.data.rooms.forEach((element) => {
            var data = []
            socket.emit('room', element.room)
            axios
              .post(`/api/chat/getLastMessage`, { chatRoom: element.room })
              .then(res => {
                if (res.data.error && res.data.error === "No last message found.") {
                  data = { chatRoom: element.room, receiverId: element.receiverId, receiverName: element.receiverName, senderId: element.senderId, senderName: element.senderName, title: element.receiverName, subtitle: 'Start a conversation with ' + element.receiverName, avatar: element.receiverPhoto, myAvatar: element.senderPhoto, date: new Date(), lastMessageContent: '', unread: 0 }
                  this.setState({ usersMatched: [...this.state.usersMatched, data] })
                } else {
                  data = { chatRoom: element.room, receiverId: element.receiverId, title: element.receiverName, subtitle: res.data.lastMessage[0].content, date: new Date(parseInt(res.data.lastMessage[0].time)), unread: 0, receiverName: element.receiverName, avatar: element.receiverPhoto, lastMessageContent: res.data.lastMessage[0].content }
                  this.setState({ existingConv: [...this.state.existingConv, data] })
                }
              })
              .catch(err => { console.log(err) });
          })
        }
        socket.on('MESSAGE_RECEIVED', async (data) => {
          var newLastMessages = this.state.existingConv
          var newConvDetected = 0
          this.state.existingConv.forEach((conv, i) => {
            if (conv.chatRoom === data.chatRoom) {
              newLastMessages[i].lastMessageContent = data.message
              newLastMessages[i].date = new Date(parseInt(data.sendAt))
              newConvDetected = 1
            }
          })
          if ((newConvDetected !== 1 || this.state.existingConv.length === 0) && data.fromUser !== sessionStorage.getItem('userData')) {
            var usersMatchedUpdate = this.state.usersMatched
            this.state.usersMatched.forEach((match, i) => {
              if (match.chatRoom === data.chatRoom) {
                usersMatchedUpdate.splice(i, 1)
              }
            })
            var newConvItem = { chatRoom: data.chatRoom, receiverId: data.receiverId, title: data.fromUser, subtitle: data.message, date: new Date(parseInt(data.sendAt)), unread: 0, receiverName: data.receiverName, avatar: data.myAvatar, lastMessageContent: data.message }
            newLastMessages = [...newLastMessages, newConvItem]
            await this.setState({ existingConv: newLastMessages })
          }
          var newMessage = { senderId: data.senderId, receiverId: data.receiverId, content: data.message, time: data.sendAt, receiverUsername: data.toUser, senderUsername: data.fromUser }
          if (data.chatRoom === this.state.activeConv.chatRoom) {
            await this.setState({ messages: [...this.state.messages, newMessage], existingConv: newLastMessages })
          }
        })
        socket.on('MESSAGE_SENT', async (data) => {
          var newLastMessages = this.state.existingConv
          this.state.existingConv.forEach((conv, i) => {
            if (conv.chatRoom === data.chatRoom) {
              newLastMessages[i].lastMessageContent = data.message
              newLastMessages[i].subtitle = data.message
              newLastMessages[i].date = new Date(parseInt(data.sendAt))
            }
          })
          this.setState({ existingConv: newLastMessages })
        })
      })
      .catch(err => {
        console.log(err);
      });
  }

  async newChat(item) {
    var usersMatchedUpdate = this.state.usersMatched
    var existingConv = this.state.existingConv
    var existingConvUpdate = []
    var index = usersMatchedUpdate.indexOf(item)
    if (index > -1) {
      usersMatchedUpdate.splice(index, 1)
      existingConvUpdate = existingConv.concat(item)
      if (usersMatchedUpdate.length !== 0) {
        await this.setState({ usersMatched: usersMatchedUpdate, existingConv: existingConvUpdate, activeConv: item, display: 'messages', messages: [] })
      } else {
        await this.setState({ usersMatched: [], existingConv: existingConvUpdate, activeConv: item, display: 'messages' })
      }
    }
  }

  async openChat(item) {
    axios
      .post(`/api/chat/getConv`, item)
      .then(async res => {
        if (res.data.error && res.data.error === "No messages found.") {
          await this.setState({ messages: [] })
        } else {
          await this.setState({ messages: res.data.messages })
        }
      })
      .catch(err => { console.log(err) });
    await this.setState({ activeConv: item })
  }

  openMatches() {
    this.setState({ display: 'matches' })
  }

  openMessages() {
    this.setState({ display: 'messages' })
  }

  render() {
    const { usersMatched, existingConv, activeConv, messages, display } = this.state
    const { socket } = this.props
    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <div className="container-fluid">
          <MDBRow className="chatRows">
            <MDBCol size='4' className="sideBarChat">
              <div className="sideBarContent">
                <h3 className="welcomeChat">Welcome to your private chat!</h3>
                <MDBRow >
                  <MDBCol>
                    <MDBBtn gradient="peach" className="chatMenuButton" onClick={this.openMessages}>Your messages</MDBBtn>
                  </MDBCol>
                  <MDBCol>
                    <MDBBtn gradient="peach" className="chatMenuButton" onClick={this.openMatches}>Your matches</MDBBtn>
                  </MDBCol>
                </MDBRow>
                {display === 'messages' ? (<div className="messagesColMenu">{existingConv.length > 0 ?
                  <ChatList className='chat-list' dataSource={existingConv} onClick={this.openChat} />
                  : "You have no chats yet."
                }</div>) : (<div className="matchesColMenu">{usersMatched.length > 0 ?
                  <ChatList className='chat-list' dataSource={usersMatched} onClick={this.newChat} />
                  : <h4>You have no new matches.</h4>
                }</div>)}
              </div>
            </MDBCol>
            <MDBCol size='8' className="chatContainer"><ChatContainer socket={socket} chatInfo={activeConv ? activeConv : "Select a conv"} chatMessages={messages ? messages : "Empty chat"} /></MDBCol>
          </MDBRow>
        </div>
      </div>
    );
  }
}