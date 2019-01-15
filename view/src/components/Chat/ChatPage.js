import React, { Component } from "react";
import io from "socket.io-client";
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from "./Events";
import ChatContainer from './Chats/ChatContainer'

const socketUrl = "localhost:8081";

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      user: sessionStorage.getItem("userData")
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  // Connect to and initializes the socket.

  initSocket = async () => {
    const socket = io(socketUrl);
    socket.on("connect", () => {
      console.log("Connected");
    });
    await this.setState({ socket });
  };

  componentDidMount() {
    const { user, socket } = this.state
    socket.emit(VERIFY_USER, user, this.checkUser)
  }

  // Sets the user property in state
  // @param user {id:number, name:string}

  setUser = (user) => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  };

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  };

  checkUser = ({ user, isUser }) => {
    if (isUser) {
      // this.setError("User name taken")
    } else {
      // this.setError("")
      this.setUser(user)
    }
  }

  // Sets the user property in state to null

  render() {
    const { socket, user } = this.state;
    return (
      <div className="global-chat-container">
        <ChatContainer socket={socket} user={user} logout={this.logout} />
      </div>
    );
  }
}