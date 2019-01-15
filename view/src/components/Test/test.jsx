import React, { Component } from "react";
import axios from "axios";

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      username: sessionStorage.getItem("userData"),
      message: "",
      messages: []
    };
    // this.onChange = this.onChange.bind(this)
    // this.handleMessage = this.handleMessage.bind(this)

    this.socket = this.props.socket

    this.sendMessage = e => {
      e.preventDefault()
      this.socket.emit('SEND_MESSAGE', {
        author: this.state.username,
        message: this.state.message
      })
      this.setState({ message: '' })
    }

    this.socket.on('RECEIVE_MESSAGE', function (data) {
      addMessage(data);
    })

    const addMessage = data => {
      console.log(data)
      this.setState({ messages: [...this.state.messages, data] })
      console.log(this.state.messages)
    }
  }

  componentDidMount() {
    axios
      .post(`/api/chat/getRooms`, sessionStorage.getItem("userId"))
      .then(res => {
        if (res.data.success) {
          console.log(res.data)
        }
      })
      .catch(err => {
        console.log(err);
      });
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
    return (
      // <div className="coucou">
      //   <ul id="messages"></ul>
      //   <div className="chatForm" action="">
      //     <input onChange={e => this.onChange(e)} id="m" autoComplete="off" /><button onClick={this.handleMessage} type="button" className="ChatButton">Send</button>
      //   </div>
      // </div>
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">Global Chat</div>
                <hr />
                <div className="messages">
                  {this.state.messages.map(message => {
                    return (
                      <div key={message.author + message.message}>{message.author}: {message.message}</div>
                    )
                  })}
                </div>
              </div>
              <div className="card-footer">
                <input type="text" placeholder="Username" value={this.state.username} className="form-control" readOnly />
                <br />
                <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                <br />
                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}