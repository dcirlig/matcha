import React, { Component } from "react";

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "",
      message: "",
      socket: this.props.socket
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // componentDidUpdate(prevProps) {
  //   console.log('update')
  //   const socket = this.props.socket
  //   if (prevProps.chatInfo !== this.props.chatInfo) {
  //     socket.emit('room', this.props.chatInfo.chatRoom)
  //   }
  // }

  handleSubmit(e) {
    e.preventDefault()
    const { message, socket } = this.state
    const chatRoom = this.props.chatInfo.chatRoom
    const receiverId = this.props.chatInfo.receiverId
    const senderId = sessionStorage.getItem('userId')
    const fromUser = sessionStorage.getItem('userData')
    const sendAt = Date.now()
    socket.emit('MESSAGE_SENT', { chatRoom, message, fromUser, senderId, receiverId, sendAt })
    this.setState({ message: "" })
    // socket.on('MESSAGE_RECEIVED', function (data) {
    //   console.log(data)
    // })
  }

  sendTyping = () => {
    this.lastUpdateTime = Date.now()
    if (!this.state.isTyping) {
      this.setState({ isTyping: true })
      // this.props.sendTyping(true)
      this.startCheckingTyping()
    }
  }

  startCheckingTyping = () => {
    this.typingInterval = setInterval(() => {
      if ((Date.now() - this.lastUpdateTime) > 300) {
        this.setState({ isTyping: false })
        this.stopCheckingTyping()
      }
    }, 300)
  }

  stopCheckingTyping = () => {
    if (this.typingInterval) {
      clearInterval(this.typingInterval)
      // this.props.sendTyping(false)
    }
  }

  render() {
    const { message } = this.state
    const { chatInfo } = this.props
    return (
      <div>
        {chatInfo !== "Select a conv" ? <div><h3>{chatInfo.receiverName} and you</h3> <div className="message-input">
          <form
            onSubmit={this.handleSubmit}
            className="message-form">
            <input
              id="message"
              ref={"messageinput"}
              type="text"
              className="form-control"
              value={message}
              autoComplete={'off'}
              placeholder="Type something interesting"
              onKeyUp={e => { e.keyCode !== 13 && this.sendTyping() }}
              onChange={
                ({ target }) => {
                  this.setState({ message: target.value })
                }
              } />
            <button
              disabled={message.length < 1}
              type="submit"
              className="send"
            >Send</button>
          </form>
        </div>
        </div>
          :
          "Choose somebody to chat with"}
      </div>
    )
  }
}