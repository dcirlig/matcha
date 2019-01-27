import React from "react";
import { Redirect } from "react-router-dom";
import { MDBAlert } from 'mdbreact';
import axios from "axios";
import "antd/dist/antd.css";
import { Card } from "antd";
import { WithContext as ReactTags } from "react-tag-input";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import Like from "../../Search/Like";
import Reports from "../../Search/Reports";

const { Meta } = Card;

class profilePreview extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      user: [],
      username: "",
      profileComplete: true
    };
    this.redirectToExplorer = this.redirectToExplorer.bind(this);
  }

  async componentWillMount() {
    await this.setState({
      userId: { userId: sessionStorage.getItem("userId") }
    });
    axios
      .post(`/api/profileComplete`, { userId: this.state.userId.userId })
      .then(async res => {
        if (res.data && res.data.error)
          await this.setState({ profileComplete: false });
      })
      .catch();
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`/api/users/${this.props.match.params.username}`)
      .then(async res => {
        if (res.data.success) {
          var data = res.data.success;
          data[0].popularity_score = data[0].popularityScore
          var users = { userVisiting: sessionStorage.getItem('userId'), userVisited: data[0].userId }
          axios
            .post(`/api/publicProfile`, users)
            .then(async res => {
              var likeBack = res.data.userInteractions.likeBack
              var liked = res.data.userInteractions.liked
              data[0].liked = liked
              var dist = res.data.userInteractions.dist
              if (this._isMounted) {
                await this.setState({ user: data, username: data[0].username, likeBack: likeBack, liked: liked, dist: dist });
              }
            })
            .catch();
        }
      })
      .catch();
  }

  getDate = date => {
    var Days = ["Mon", "Tu", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var Months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Dec"
    ];
    var day = Days[date.getDay()];
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var dd = date.getDate();
    var mm = Months[date.getMonth()];
    var yyyy = date.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    var data =
      day + ", " + dd + " " + mm + " " + yyyy + ", " + hour + ":" + minutes;
    return data;
  };

  redirectToExplorer() {
    this.props.history.push("/explorer");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { dist, likeBack, liked, user, username, profileComplete } = this.state;
    if (user[0]) { var profil_image = user[0].profilImage; var popularity_score = parseInt(user[0].popularityScore) }
    if (!profileComplete) {
      return (
        <Redirect
          to={{
            pathname: `/users/${sessionStorage.getItem("userData")}`,
            state: { completeProfile: profileComplete }
          }}
        />
      );
    }
    return (
      <div className="public-profile-preview-page">
        {user.map((item, index) => (
          <div className="profile-preview-container" key={index}>
            <Card
              hoverable
              cover={
                item.profilImage && item.images ? (
                  <Slider
                    className="slider-wrapper-profile"
                    style={{ width: "50" }}
                    infinite={true}
                  >
                    <div
                      key={"profilImagePreview"}
                      className="slider-content-profile"
                      style={
                        item.profilImage
                          ? item.profilImage.includes("unsplash")
                            ? {
                              background: `url('${
                                item.profilImage
                                }') no-repeat center center`
                            }
                            : {
                              background: `url('https://localhost:4000/${
                                item.profilImage
                                }')  no-repeat center center`
                            }
                          : ""
                      }
                    />
                    {item.images.map((element, index) => (
                      <div
                        key={index}
                        className="slider-content-profile"
                        style={{
                          background: `url('https://localhost:4000/${
                            element.url
                            }') no-repeat center center`
                        }}
                      />
                    ))}
                  </Slider>
                ) : item.profilImage ? (
                  <Slider
                    className="slider-wrapper-profile"
                    style={{ width: "50" }}
                    infinite={true}
                    buttonDisabled="disabled"
                  >
                    <div
                      key={"profilImagePreview"}
                      className="slider-content-profile"
                      style={
                        item.profilImage
                          ? item.profilImage.includes("unsplash")
                            ? {
                              background: `url('${
                                item.profilImage
                                }') no-repeat center center`
                            }
                            : {
                              background: `url('https://localhost:4000/${
                                item.profilImage
                                }')  no-repeat center center`
                            }
                          : ""
                      }
                    />
                  </Slider>
                ) : (
                      <Slider
                        className="slider-wrapper-profile"
                        style={{ width: "50" }}
                        infinite={true}
                        buttonDisabled="disabled"
                      >
                        <div
                          key={"profilImagePreview"}
                          className="slider-content-profile"
                          style={{
                            background: `url('https://localhost:4000/profilPhoto/avatar-default.jpg') no-repeat center center`
                          }}
                        />
                      </Slider>
                    )
              }
            >
              {likeBack ? <MDBAlert color="info" dismiss>{username} already likes you!</MDBAlert> : ""}
              <b>
                {
                  profil_image ? (
                    <span>
                      <Reports
                        item={item}
                        redirectToExplorer={this.redirectToExplorer}
                      />
                      <Like
                        item={item}
                        popularity_score={popularity_score}
                        liked={liked}
                        socket={this.props.socket}
                      />
                    </span>
                  ) : (
                      <MDBAlert color="warning">
                        Incomplete profile
              </MDBAlert>
                    )
                }
                {item.online === "online" ? (
                  <div className="connexionInfo">
                    <div className="onlineUsers" />
                    <h5>Online</h5>
                  </div>
                ) : (
                    <div className="connexionInfo">
                      <div className="offlineUsers" />
                      <h5>
                        {this.getDate(new Date(parseInt(item.online)))}
                      </h5>
                    </div>
                  )}
                {item.firstname} {item.lastname} -{" "}
                {dist || dist === 0
                  ? dist <= 1
                    ? "<1 km away"
                    : Math.round(dist) + "km away"
                  : item.location}{" "}
                <br />
                {item.gender === "male" ? "Man" : "Woman"},{" "}
                {item.sexualOrientation} <br />
                {item.age} y.o.
              </b>

              <Meta title={"@" + item.username} description={item.bio} style={{ wordBreak: 'break-all' }} />
              <ReactTags 
                classNames={{
                  tags: "tagsContainer",
                  selected: "selectedSearchTags",
                  tag: "allSearchTags"
                }}
                tags={item.tags}
                readOnly={true}
              />
            </Card>
          </div>
        ))}
      </div>
    );
  }
}

export default profilePreview;
