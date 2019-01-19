import React, { Component } from "react";
import axios from "axios";
import { MDBRow, MDBCol, MDBBtn } from "mdbreact";
import Header from "../Navigation/Navigation";
import ChatContainer from "./ChatContainer";
import { Helmet } from "react-helmet";
import { ChatList } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';
import { notification } from "antd";

export default class ChatPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem("userId"),
      isLoggedIn: true,
      usersMatched: [],
      existingConv: [],
      activeConv: "",
      socket: this.props.socket,
      messages: [],
      display: 'messages',
      open: false,
      count: ""
    }
    this.newChat = this.newChat.bind(this)
    this.openChat = this.openChat.bind(this)
    this.openMatches = this.openMatches.bind(this)
    this.openMessages = this.openMessages.bind(this)
    this.openSelectChats = this.openSelectChats.bind(this)
  }

  componentWillMount() {
    axios
      .post(`/api/notifications`, { userId: this.state.userId })
      .then(res => {
        if (res.data.success) {
          this.setState({ count: res.data.count });
        } else {
          console.log("error");
        }
      });
  }

  componentDidMount() {
    this._isMounted = true;
    const socket = this.props.socket
    socket.on("connect", () => {
      socket.emit("notif", sessionStorage.getItem("userId"));
      socket.on("NOTIF_RECEIVED", async data => {
        const openNotificationWithIcon = type => {
          notification[type]({
            message: data.fromUser + " " + data.message
          });
        };
        var count = data.count + this.state.count
        if (this._isMounted) {
          this.setState({ count: count })
        }
        openNotificationWithIcon("info");
      });
    });
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
                  if (this._isMounted === true) {
                    this.setState({ usersMatched: [...this.state.usersMatched, data] })
                  }
                } else {
                  data = { chatRoom: element.room, receiverId: element.receiverId, title: element.receiverName, subtitle: res.data.lastMessage[0].content, date: new Date(parseInt(res.data.lastMessage[0].time)), unread: 0, receiverName: element.receiverName, avatar: element.receiverPhoto, lastMessageContent: res.data.lastMessage[0].content }
                  if (this._isMounted === true) {
                    this.setState({ existingConv: [...this.state.existingConv, data] })
                  }
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
            if (this._isMounted === true) {
              await this.setState({ existingConv: newLastMessages })
            }
          }
          var newMessage = { senderId: data.senderId, receiverId: data.receiverId, content: data.message, time: data.sendAt, receiverUsername: data.toUser, senderUsername: data.fromUser }
          if (data.chatRoom === this.state.activeConv.chatRoom) {
            if (this._isMounted === true) {
              await this.setState({ messages: [...this.state.messages, newMessage], existingConv: newLastMessages })
            }
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
          if (this._isMounted === true) {
            this.setState({ existingConv: newLastMessages })
          }
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
        if (this._isMounted === true) {
          await this.setState({ usersMatched: usersMatchedUpdate, existingConv: existingConvUpdate, activeConv: item, display: 'messages', messages: [] })
        }
      } else {
        if (this._isMounted === true) {
          await this.setState({ usersMatched: [], existingConv: existingConvUpdate, activeConv: item, display: 'messages' })
        }
      }
    }
  }

  async openChat(item) {
    axios
      .post(`/api/chat/getConv`, item)
      .then(async res => {
        if (res.data.error && res.data.error === "No messages found." && this._isMounted === true) {
          await this.setState({ messages: [] })
        } else {
          if (this._isMounted === true) {
            await this.setState({ messages: res.data.messages })
          }
        }
      })
      .catch(err => { console.log(err) });
    if (this._isMounted === true) {
      await this.setState({ activeConv: item })
    }
  }

  openMatches() {
    if (this._isMounted === true) {
      this.setState({ display: 'matches' })
    }
  }

  openMessages() {
    if (this._isMounted === true) {
      this.setState({ display: 'messages' })
    }
  }

  openSelectChats() {
    if (this._isMounted === true) {
      this.setState({ open: !this.state.open });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { usersMatched, existingConv, activeConv, messages, display, open, count } = this.state
    const { socket } = this.props
    return (
      <div>
        <Header notSeenNotifications={count} isLoggedIn={this.state.isLoggedIn} />
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <div className="container-fluid">
          <MDBRow className="chatRows">
            <MDBCol size='4' className="sideBarChat">
              <MDBBtn
                onClick={this.openSelectChats}
                className="small-button explorer"
                rounded
                size="lg"
                gradient="peach"
                style={{ display: 'none' }}
              >Change chat
              </MDBBtn>
              {open ? <div className="sideBarContentMobile">
                <MDBRow >
                  <MDBCol>
                    <MDBBtn gradient="peach" className="chatMenuButton" onClick={this.openMessages}>Your messages</MDBBtn>
                  </MDBCol>
                  <MDBCol>
                    <MDBBtn gradient="peach" className="chatMenuButton" onClick={this.openMatches}>Your matches</MDBBtn>
                  </MDBCol>
                </MDBRow>
                {display === 'messages' && open ? (<div className="messagesColMenu">{existingConv.length > 0 ?
                  <ChatList className='chat-list' dataSource={existingConv} onClick={this.openChat} />
                  : "You have no chats yet."
                }</div>) : (<div className="matchesColMenu">{usersMatched.length > 0 ?
                  <ChatList className='chat-list' dataSource={usersMatched} onClick={this.newChat} />
                  : <h4>You have no new matches.</h4>
                }</div>)}</div> :
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
                </div>}
            </MDBCol>
            <MDBCol size='8' className="chatContainer"><ChatContainer socket={socket} chatInfo={activeConv ? activeConv : "Select a conv"} chatMessages={messages ? messages : "Empty chat"} /></MDBCol>
          </MDBRow>
        </div>
      </div>
    );
  }
}