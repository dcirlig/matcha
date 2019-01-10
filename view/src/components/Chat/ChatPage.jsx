import React from "react";
import io from "socket.io-client";
import { USER_CONNECTED, LOGOUT } from "./Events";
import ChatContainer from "./ChatContainer";

const socketUrl = "localhost:8081";

class ChatPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  // Connect to and initializes the socket.

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on("connect", () => {
      console.log("Connected")
    });
    this.setState({ socket })
  };

  // Sets the user property in state
  // @param user {id:number, name:string}

  setUser = () => {
    const { socket } = this.state
    const user = sessionStorage.getItem('userData')
    socket.emit(USER_CONNECTED, user)
    this.setState({ user: user });
  }

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  };

  render() {
    const { socket, user } = this.state;
    return (
      <ChatContainer socket={socket} user={user} logout={this.logout} />
    )
  }
}

export default ChatPage;