import React, { Component } from "react";
import axios from "axios";
import { MDBRow, MDBCol } from "mdbreact";
import Header from "../Navigation/Navigation";
import ChatContainer from "./ChatContainer";

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      usersMatched: [],
      existingConv: [],
      activeConv: "",
      socket: this.props.socket
    }
    // this.onChange = this.onChange.bind(this)
    // this.handleMessage = this.handleMessage.bind(this)
    this.newChat = this.newChat.bind(this)

    // this.socket = this.props.socket

    // this.sendMessage = e => {
    //   e.preventDefault()
    //   this.socket.emit('SEND_MESSAGE', {
    //     author: this.state.username,
    //     message: this.state.message
    //   })
    //   this.setState({ message: '' })
    // }

    // this.socket.on('RECEIVE_MESSAGE', function (data) {
    //   addMessage(data);
    // })

    // const addMessage = data => {
    //   console.log(data)
    //   this.setState({ messages: [...this.state.messages, data] })
    //   console.log(this.state.messages)
    // }
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
            data = { chatRoom: element.room, receiverId: element.receiverId, receiverName: element.receiverName }
            if (element.existingChat === null) {
              this.setState({ usersMatched: [...this.state.usersMatched, data] })
            } else {
              this.setState({ existingConv: [...this.state.usersMatched, data] })
            }
          }
          )
        }
        socket.on('MESSAGE_RECEIVED', function (data) {
          console.log(data)
        })
      })
      .catch(err => {
        console.log(err);
      });
  }

  newChat(item) {
    var usersMatchedUpdate = this.state.usersMatched
    var existingConv = this.state.existingConv
    var existingConvUpdate = []
    var index = usersMatchedUpdate.indexOf(item)
    if (index > -1) {
      usersMatchedUpdate.splice(index, 1)
      existingConvUpdate = existingConv.concat(item)
      if (usersMatchedUpdate.length !== 0) {
        this.setState({ usersMatched: usersMatchedUpdate, existingConv: existingConvUpdate, activeConv: item })
      } else {
        this.setState({ usersMatched: [], existingConv: existingConvUpdate, activeConv: item })
      }
    }
  }

  // test() {
  //   const socket = this.props.socket
  //   socket.on('chat message', function (msg) {
  //     console.log('message', msg)
  //   })
  // }

  // onChange(e) {
  //   const message = e.target.value
  //   this.setState({ message: message })
  // }

  // handleMessage(e) {
  //   const socket = this.props.socket
  //   const message = this.state.message
  //   socket.emit('chatMessage', message);
  // }

  render() {
    const { usersMatched, existingConv, activeConv } = this.state
    const { socket } = this.props
    return (
      // <div className="coucou">
      //   <ul id="messages"></ul>
      //   <div className="chatForm" action="">
      //     <input onChange={e => this.onChange(e)} id="m" autoComplete="off" /><button onClick={this.handleMessage} type="button" className="ChatButton">Send</button>
      //   </div>
      // </div>


      // <div className="container">
      //   <div className="row">
      //     <div className="col-4">
      //       <div className="card">
      //         <div className="card-body">
      //           <div className="card-title">Global Chat</div>
      //           <hr />
      //           <div className="messages">
      //             {this.state.messages.map(message => {
      //               return (
      //                 <div key={message.author + message.message}>{message.author}: {message.message}</div>
      //               )
      //             })}
      //           </div>
      //         </div>
      //         <div className="card-footer">
      //           <input type="text" placeholder="Username" value={this.state.username} className="form-control" readOnly />
      //           <br />
      //           <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
      //           <br />
      //           <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <div className="container-fluid">
          <MDBRow className="chatRows">
            <MDBCol size='4' className="sideBar">
              Sidebar
              <MDBRow>
                <MDBCol>
                  <h3>Your messages</h3>
                  {existingConv.length > 0 ?
                    existingConv.map((item, i) => {
                      return <div onClick={this.newChat.bind(this, item)} key={item.chatRoom}>{item.receiverName}</div>
                    })
                    : "You have no chats yet."
                  }
                </MDBCol>
                <MDBCol>
                  <h3>Your matches</h3>
                  {usersMatched.length > 0 ?
                    usersMatched.map((item, i) => {
                      return <div onClick={this.newChat.bind(this, item)} key={item.chatRoom}>{item.receiverName}</div>
                    })
                    : <h4>You have no new matches.</h4>
                  }
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <MDBCol size='8' className="chatContainer"><ChatContainer socket={socket} chatInfo={activeConv ? activeConv : "Select a conv"} /></MDBCol>
          </MDBRow>
        </div>
      </div>
    );
  }
}