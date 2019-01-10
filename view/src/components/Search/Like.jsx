import React, { Component } from "react";
import "antd/dist/antd.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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

  componentDidMount() {}

  handleLike = async e => {
    console.log(e.username);
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

    axios.post(`/api/like`, this.state).then(async res => {
      console.log(res.data);
      await this.setState({
        popularity_score: res.data.popularity_score
      });
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
