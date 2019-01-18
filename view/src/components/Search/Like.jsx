import React, { Component } from "react";
import "antd/dist/antd.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { notification } from "antd";

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

  // openNotificationWithIcon = type => {
  //   notification[type]({
  //     message: "Notification Title",
  //     description:
  //       "This is the content of the notification. This is the content of the notification. This is the content of the notification."
  //   });
  // };

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
    axios.post(`/api/like`, this.state).then(async res => {
      if (res.data.success) {
        console.log("succes");
        await this.setState({
          popularity_score: res.data.popularity_score
        });
        var message = " have " + res.data.status + " your profile !";

        socket.emit("NOTIF_SENT", {
          likeroom,
          message,
          fromUser,
          senderId,
          receiverId,
          sendAt
        });
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
