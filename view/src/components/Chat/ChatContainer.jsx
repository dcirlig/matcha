import React, { Component } from "react";
import { MessageBox } from "react-chat-elements";
import { MDBBtn, MDBIcon } from "mdbreact";
import "react-chat-elements/dist/main.css";
import matchaLogo from "../../images/matcha_logo_full.png";

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "",
      message: "",
      socket: this.props.socket,
      chatMessages: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.chatInfo.chatRoom !== this.props.chatInfo.chatRoom) {
      this.setState({ chatMessages: this.props.chatMessages, message: "" });
    } else if (
      prevProps.chatInfo.chatRoom === this.props.chatInfo.chatRoom &&
      prevProps.chatMessages !== this.props.chatMessages &&
      this.props.chatMessages !== "Empty chat"
    ) {
      await this.setState({ chatMessages: this.props.chatMessages });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var { message, socket } = this.state;
    const chatRoom = this.props.chatInfo.chatRoom;
    const receiverId = this.props.chatInfo.receiverId;
    const senderId = sessionStorage.getItem("userId");
    const fromUser = sessionStorage.getItem("userData");
    const toUser = this.props.chatInfo.receiverName;
    const sendAt = Date.now();
    const avatar = this.props.chatInfo.avatar;
    const myAvatar = this.props.chatInfo.myAvatar;
    var likeroom = receiverId;
    const notif_message = " has sent you a new message!";
    socket.emit("MESSAGE_SENT", {
      chatRoom,
      message,
      fromUser,
      toUser,
      senderId,
      receiverId,
      sendAt,
      avatar,
      myAvatar
    });
    socket.emit("NOTIF_SENT", {
      likeroom,
      message: notif_message,
      fromUser,
      senderId,
      receiverId,
      sendAt
    });
    this.setState({ message: "" });
  }

  onChange(e) {
    if (e.target.value) {
      var value = e.target.value;
      value = value.match(
        /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s:,;?.!()[\]"'/]+$/
      );
      if (value && e.target.value.length >= 140) {
        this.setState({
          formError:
            "Too long! Your message must contain 140 characters maximum."
        });
        return;
      }
      if (value === null && e.target.value !== "") {
        this.setState({
          formError:
            "Your message must contain only upper and lower case letters, numbers, punctuation and spaces."
        });
        return;
      }
      this.setState({ message: value, formError: "" });
    } else {
      this.setState({
        formError: "",
        message: ""
      });
      return;
    }
  }

  render() {
    const { message, chatMessages, formError } = this.state;
    const { chatInfo } = this.props;
    const thisUserId = sessionStorage.getItem("userId");
    return (
      <div className="chatContainerDiv">
        {chatInfo !== "Select a conv" ? (
          <div className="chatContainerDiv">
            <h3 className="chatHeading">{chatInfo.receiverName} and you</h3>
            <div className="chatMessages">
              {chatMessages !== "Empty chat"
                ? chatMessages.map((item, i) => {
                  var position;
                  if (parseInt(item.senderId) === parseInt(thisUserId)) {
                    position = "right";
                  } else {
                    position = "left";
                  }
                  return (
                    <div
                      key={
                        item.chatRoom +
                        Math.random()
                          .toString(36)
                          .substring(2, 15) +
                        Math.random()
                          .toString(36)
                          .substring(2, 15) +
                        item.content
                      }
                    >
                      <MessageBox
                        position={position}
                        type={"text"}
                        title={item.senderUsername}
                        text={item.content}
                        date={new Date(parseInt(item.time))}
                      />
                    </div>
                  );
                })
                : ""}
            </div>
            <div className="message-input">
              {formError ? formError : ""}
              <form onSubmit={this.handleSubmit} className="message-form">
                <input
                  ref={"messageinput"}
                  type="text"
                  className="form-control border-0 border-dark"
                  value={message ? message : ""}
                  autoComplete={"off"}
                  placeholder="Type something interesting"
                  onChange={e => this.onChange(e)}
                />
                <MDBBtn
                  gradient="peach"
                  disabled={message.length < 1 || formError !== ""}
                  type="submit"
                  className="send"
                >
                  Send
                </MDBBtn>
              </form>
            </div>
          </div>
        ) : (
            <div>
              <img id="logoChatContainer" src={matchaLogo} alt={"logo"} />
              <MDBIcon className="waitingIcon" icon="gratipay" spin size="3x" fixed />
              <span className="sr-only">Loading...</span>
              <h1 className="selectConv">Select a conversation to start chatting!</h1>
            </div>
          )}
      </div>
    );
  }
}
