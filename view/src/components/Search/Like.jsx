import React, { Component } from "react";
import "antd/dist/antd.css";
import axios from "axios";

const INITIAL_STATE = {
  likeTransmitter: sessionStorage.getItem("userId"),
  likedUser: "",
  popularity_score: "",
  like: null
};

class Like extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.handleLike = this.handleLike.bind(this);
  }

  handleLike = async e => {
    var socket = this.props.socket;
    if (this.state.like != null) {
      await this.setState({
        like: !this.state.like,
        likedUser: e.userId
      });
    } else {
      await this.setState({
        like: !e.liked,
        likedUser: e.userId,
        popularity_score: e.popularity_score
      });
    }

    const likeroom = this.state.likedUser;
    const receiverId = this.state.likedUser;
    const senderId = sessionStorage.getItem("userId");
    const fromUser = sessionStorage.getItem("userData");
    const sendAt = Date.now();
    this.setState({ likeTransmitter: senderId });
    axios.post(`/api/like`, this.state).then(async res => {
      if (res.data.success) {
        await this.setState({
          popularity_score: res.data.popularity_score
        });
        var message = " has " + res.data.status + " your profile !";
        await socket.emit("NOTIF_SENT", {
          likeroom,
          message,
          fromUser,
          senderId,
          receiverId,
          sendAt
        });
        if (res.data.match) {
          message = " likes you back. It's a match!";
          await socket.emit("NOTIF_SENT", {
            likeroom,
            message,
            fromUser,
            senderId,
            receiverId,
            sendAt
          });
        }
        if (res.data.isMatch) {
          message = " has disliked you. Match over!";
          await socket.emit("NOTIF_SENT", {
            likeroom,
            message,
            fromUser,
            senderId,
            receiverId,
            sendAt
          });
        }
      }
    });
  };

  render() {
    var { like } = this.state;
    const { item, popularity_score, liked } = this.props;
    return (
      <div className="media-content">
        <ul className="list-inline">
          <li className="list-inline-item" onClick={e => this.handleLike(item)}>
            <i
              className="fas fa-heart"
              style={{
                marginRight: "0.5rem",
                color: like == null ? (liked ? "red" : "") : like ? "red" : ""
              }}
            />
            {like == null ? popularity_score : this.state.popularity_score}
          </li>
        </ul>
      </div>
    );
  }
}

export default Like;
