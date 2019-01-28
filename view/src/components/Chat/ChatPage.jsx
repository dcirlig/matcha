import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { MDBRow, MDBCol, MDBBtn, MDBAlert } from "mdbreact";
import Header from "../Navigation/Navigation";
import ChatContainer from "./ChatContainer";
import { Helmet } from "react-helmet";
import { ChatList } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import * as routes from "../../constants/routes";

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
      display: "messages",
      open: false,
      count: "",
      profileComplete: true
    };
    this.newChat = this.newChat.bind(this);
    this.openChat = this.openChat.bind(this);
    this.openMatches = this.openMatches.bind(this);
    this.openMessages = this.openMessages.bind(this);
    this.openSelectChats = this.openSelectChats.bind(this);
  }

  componentWillMount() {
    axios
      .post(`/api/profileComplete`, { userId: this.state.userId })
      .then(res => {
        if (res.data && res.data.error)
          this.setState({ profileComplete: false });
      })
      .catch();
    axios
      .post(`/api/notifications`, { userId: this.state.userId })
      .then(res => {
        if (res.data.success && this.state.profileComplete) {
          this.setState({ count: res.data.count });
        }
      })
      .catch();
  }

  componentDidMount() {
    this._isMounted = true;
    const socket = this.props.socket;
    socket.emit("notif", this.state.userId);
    socket.on("NOTIF_RECEIVED", async data => {
      var count = data.count + this.state.count;
      if (this._isMounted) {
        this.setState({ count: count });
      }
    });
    axios
      .post(`/api/chat/getRooms`, sessionStorage)
      .then(res => {
        if (res.data.success) {
          res.data.rooms.forEach(element => {
            var data = [];
            var avatar = "";
            var myAvatar = "";
            socket.emit("room", element.room);
            axios
              .post(`/api/chat/getLastMessage`, { chatRoom: element.room })
              .then(res => {
                if (
                  !element.receiverPhoto.includes("http") ||
                  !element.receiverPhoto.includes("https")
                ) {
                  avatar = "https://localhost:4000/" + element.receiverPhoto;
                } else {
                  avatar = element.receiverPhoto;
                }
                if (
                  !element.senderPhoto.includes("http") ||
                  !element.senderPhoto.includes("https")
                ) {
                  myAvatar = "https://localhost:4000/" + element.senderPhoto;
                } else {
                  myAvatar = element.senderPhoto;
                }
                if (
                  res.data.error &&
                  res.data.error === "No last message found."
                ) {
                  data = {
                    chatRoom: element.room,
                    receiverId: element.receiverId,
                    receiverName: element.receiverName,
                    senderId: element.senderId,
                    senderName: element.senderName,
                    title: element.receiverName,
                    subtitle:
                      "Start a conversation with " + element.receiverName,
                    avatar: avatar,
                    myAvatar: myAvatar,
                    date: new Date(parseInt(element.time)),
                    lastMessageContent: "",
                    unread: 0
                  };
                  if (this._isMounted === true) {
                    this.setState({
                      usersMatched: [...this.state.usersMatched, data]
                    });
                  }
                } else {
                  data = {
                    chatRoom: element.room,
                    receiverId: element.receiverId,
                    title: element.receiverName,
                    subtitle: res.data.lastMessage[0].content,
                    date: new Date(parseInt(res.data.lastMessage[0].time)),
                    unread: 0,
                    receiverName: element.receiverName,
                    avatar: avatar,
                    lastMessageContent: res.data.lastMessage[0].content
                  };
                  if (this._isMounted === true) {
                    this.setState({
                      existingConv: [...this.state.existingConv, data]
                    });
                  }
                }
              })
              .catch();
          });
        }
        socket.on("MESSAGE_RECEIVED", async data => {
          var newLastMessages = this.state.existingConv;
          var newConvDetected = 0;
          this.state.existingConv.forEach((conv, i) => {
            if (conv.chatRoom === data.chatRoom) {
              newLastMessages[i].lastMessageContent = data.message;
              newLastMessages[i].date = new Date(parseInt(data.sendAt));
              newConvDetected = 1;
            }
          });
          if (
            (newConvDetected !== 1 || this.state.existingConv.length === 0) &&
            data.fromUser !== sessionStorage.getItem("userData")
          ) {
            var usersMatchedUpdate = this.state.usersMatched;
            this.state.usersMatched.forEach((match, i) => {
              if (match.chatRoom === data.chatRoom) {
                usersMatchedUpdate.splice(i, 1);
              }
            });
            var newConvItem = {
              chatRoom: data.chatRoom,
              receiverId: data.receiverId,
              title: data.fromUser,
              subtitle: data.message,
              date: new Date(parseInt(data.sendAt)),
              unread: 0,
              receiverName: data.receiverName,
              avatar: data.myAvatar,
              lastMessageContent: data.message
            };
            newLastMessages = [...newLastMessages, newConvItem];
            if (this._isMounted === true) {
              await this.setState({ existingConv: newLastMessages });
            }
          }
          var newMessage = {
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.message,
            time: data.sendAt,
            receiverUsername: data.toUser,
            senderUsername: data.fromUser
          };
          if (data.chatRoom === this.state.activeConv.chatRoom) {
            if (this._isMounted === true) {
              await this.setState({
                messages: [...this.state.messages, newMessage],
                existingConv: newLastMessages
              });
            }
          }
        });
        socket.on("MESSAGE_SENT", async data => {
          var newLastMessages = this.state.existingConv;
          this.state.existingConv.forEach((conv, i) => {
            if (conv.chatRoom === data.chatRoom) {
              newLastMessages[i].lastMessageContent = data.message;
              newLastMessages[i].subtitle = data.message;
              newLastMessages[i].date = new Date(parseInt(data.sendAt));
            }
          });
          if (this._isMounted === true) {
            this.setState({ existingConv: newLastMessages });
          }
        });
      })
      .catch();
  }

  async newChat(item) {
    var usersMatchedUpdate = this.state.usersMatched;
    var existingConv = this.state.existingConv;
    var existingConvUpdate = [];
    var index = usersMatchedUpdate.indexOf(item);
    if (index > -1) {
      usersMatchedUpdate.splice(index, 1);
      existingConvUpdate = existingConv.concat(item);
      if (usersMatchedUpdate.length !== 0) {
        if (this._isMounted === true) {
          await this.setState({
            usersMatched: usersMatchedUpdate,
            existingConv: existingConvUpdate,
            activeConv: item,
            display: "messages",
            messages: []
          });
        }
      } else {
        if (this._isMounted === true) {
          await this.setState({
            usersMatched: [],
            existingConv: existingConvUpdate,
            activeConv: item,
            display: "messages"
          });
        }
      }
    }
  }

  async openChat(item) {
    axios
      .post(`/api/chat/getConv`, item)
      .then(async res => {
        if (
          res.data.error &&
          res.data.error === "No messages found." &&
          this._isMounted === true
        ) {
          await this.setState({ messages: [] });
        } else {
          if (this._isMounted === true) {
            await this.setState({ messages: res.data.messages });
          }
        }
      })
      .catch();
    if (this._isMounted === true) {
      await this.setState({ activeConv: item });
    }
  }

  openMatches() {
    if (this._isMounted === true) {
      this.setState({ display: "matches" });
    }
  }

  openMessages() {
    if (this._isMounted === true) {
      this.setState({ display: "messages" });
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
    const {
      usersMatched,
      existingConv,
      activeConv,
      messages,
      display,
      open,
      count,
      profileComplete
    } = this.state;
    const { socket } = this.props;
    if (!profileComplete) {
      return (
        <Redirect
          to={{
            pathname: `/users/${sessionStorage.getItem("userData")}`,
            state: { completeProfile: profileComplete }
          }}
        />
      );
    }
    const userData = sessionStorage.getItem("userData");
    if (!this._isMounted && !userData) {
      return <Redirect to={routes.SIGN_IN} />;
    }
    return (
      <div>
        <Header
          notSeenNotifications={count}
          isLoggedIn={this.state.isLoggedIn}
        />
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <div className="container-fluid">
          <MDBRow className="chatRows">
            <MDBCol size="4" className="sideBarChat">
              <MDBBtn
                onClick={this.openSelectChats}
                className="small-button explorer"
                rounded
                size="lg"
                gradient="peach"
                style={{ display: "none" }}
              >
                Change chat
              </MDBBtn>
              {open ? (
                <div className="sideBarContentMobile">
                  <MDBRow>
                    <MDBCol>
                      <MDBBtn
                        gradient="peach"
                        className="chatMenuButton"
                        onClick={this.openMessages}
                      >
                        Your messages
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol>
                      <MDBBtn
                        gradient="peach"
                        className="chatMenuButton"
                        onClick={this.openMatches}
                      >
                        Your matches
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                  {display === "messages" && open ? (
                    <div className="messagesColMenu">
                      {existingConv.length > 0 ? (
                        <ChatList
                          className="chat-list"
                          dataSource={existingConv}
                          onClick={this.openChat}
                        />
                      ) : (
                          <MDBAlert color="info" dismiss>You have no chats yet.</MDBAlert>
                        )}
                    </div>
                  ) : (
                      <div className="matchesColMenu">
                        {usersMatched.length > 0 ? (
                          <ChatList
                            className="chat-list"
                            dataSource={usersMatched}
                            onClick={this.newChat}
                          />
                        ) : (
                            <MDBAlert color="info" dismiss>You have no new matches.</MDBAlert>
                          )}
                      </div>
                    )}
                </div>
              ) : (
                  <div className="sideBarContent">
                    <h3 className="welcomeChat">Welcome to your private chat!</h3>
                    <MDBRow>
                      <MDBCol>
                        <MDBBtn
                          gradient="peach"
                          className="chatMenuButton"
                          onClick={this.openMessages}
                        >
                          Your messages
                      </MDBBtn>
                      </MDBCol>
                      <MDBCol>
                        <MDBBtn
                          gradient="peach"
                          className="chatMenuButton"
                          onClick={this.openMatches}
                        >
                          Your matches
                      </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                    {display === "messages" ? (
                      <div className="messagesColMenu">
                        {existingConv.length > 0 ? (
                          <ChatList
                            className="chat-list"
                            dataSource={existingConv}
                            onClick={this.openChat}
                          />
                        ) : (
                            <MDBAlert color="info" dismiss>You have no chats yet.</MDBAlert>
                          )}
                      </div>
                    ) : (
                        <div className="matchesColMenu">
                          {usersMatched.length > 0 ? (
                            <ChatList
                              className="chat-list"
                              dataSource={usersMatched}
                              onClick={this.newChat}
                            />
                          ) : (
                              <MDBAlert color="info" dismiss>You have no new matches.</MDBAlert>
                            )}
                        </div>
                      )}
                  </div>
                )}
            </MDBCol>
            {activeConv ? <MDBCol size="8" className="chatContainer">
              <ChatContainer
                socket={socket}
                chatInfo={activeConv}
                chatMessages={messages ? messages : "Empty chat"}
              />
            </MDBCol> : <MDBCol size="8" className="chatContainer" style={{ overflow: 'visible' }}>
                <ChatContainer
                  socket={socket}
                  chatInfo={"Select a conv"}
                  chatMessages={messages ? messages : "Empty chat"}
                />
              </MDBCol>}
          </MDBRow>
        </div>
      </div>
    );
  }
}
