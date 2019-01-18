import React, { Component } from "react";
import { MessageBox } from 'react-chat-elements';
import { MDBBtn } from "mdbreact";
import 'react-chat-elements/dist/main.css';

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "",
      message: "",
      socket: this.props.socket,
      chatMessages: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.chatInfo.chatRoom !== this.props.chatInfo.chatRoom) {
      this.setState({ chatMessages: this.props.chatMessages, message: "" })
    } else if (prevProps.chatInfo.chatRoom === this.props.chatInfo.chatRoom && prevProps.chatMessages !== this.props.chatMessages && this.props.chatMessages !== "Empty chat") {
      await this.setState({ chatMessages: this.props.chatMessages })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { message, socket } = this.state
    const chatRoom = this.props.chatInfo.chatRoom
    const receiverId = this.props.chatInfo.receiverId
    const senderId = sessionStorage.getItem('userId')
    const fromUser = sessionStorage.getItem('userData')
    const toUser = this.props.chatInfo.receiverName
    const sendAt = Date.now()
    const avatar = this.props.chatInfo.avatar
    const myAvatar = this.props.chatInfo.myAvatar
    socket.emit('MESSAGE_SENT', { chatRoom, message, fromUser, toUser, senderId, receiverId, sendAt, avatar, myAvatar })
    this.setState({ message: "" })
  }

  render() {
    const { message, chatMessages } = this.state
    const { chatInfo } = this.props
    const thisUserId = sessionStorage.getItem('userId')
    return (
      <div className="chatContainerDiv">
        {chatInfo !== "Select a conv" ? <div className="chatContainerDiv"><h3 className="chatHeading">{chatInfo.receiverName} and you</h3>
          <div className="chatMessages">
            {chatMessages !== "Empty chat" ?
              chatMessages.map((item, i) => {
                var position
                if (parseInt(item.senderId) === parseInt(thisUserId)) {
                  position = 'right'
                } else {
                  position = 'left'
                }
                return <div key={item.chatRoom + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + item.content}>
                  <MessageBox
                    position={position}
                    type={'text'}
                    title={item.senderUsername}
                    text={item.content}
                    date={new Date(parseInt(item.time))}
                  />
                </div>
              }) :
              ""}
          </div>
          <div className="message-input">
            <form
              onSubmit={this.handleSubmit}
              className="message-form">
              <input
                ref={"messageinput"}
                type="text"
                className="form-control border-0 border-dark"
                value={message}
                autoComplete={'off'}
                placeholder="Type something interesting"
                onChange={
                  ({ target }) => {
                    this.setState({ message: target.value })
                  }
                } />
              <MDBBtn
                gradient="peach"
                disabled={message.length < 1}
                type="submit"
                className="send"
              >Send</MDBBtn>
            </form>
          </div>
        </div>
          :
          "Choose somebody to chat with"}
      </div>
    )
  }
}