import React from "react";
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
      username: ""
    };
    this.redirectToExplorer = this.redirectToExplorer.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`/api/users/${this.props.match.params.username}`)
      .then(async res => {
        if (res.data.success) {
          var data = res.data.success;
          await this.setState({ user: data, username: data[0].username });
        }
      })
      .catch();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      await this.setState({ username: this.props.match.params.username });
    }
    if (this.props.refresh === true) {
      axios
        .get(`/api/users/${this.state.username}`)
        .then(async res => {
          if (res.data.success) {
            var data = res.data.success;
            await this.setState({ user: data });
            this.props.stopRefresh();
          }
        })
        .catch();
    }
  }

  redirectToExplorer() {
    this.props.history.push("/explorer");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { user } = this.state;
    var distance = null;
    var profileComplete = null;
    if (this.props.location && this.props.location.state) {
      if (
        this.props.location.state.distance ||
        this.props.location.state.distance === 0
      ) {
        distance = this.props.location.state.distance;
      }
      if (this.props.location.state.profileComplete) {
        profileComplete = this.props.location.state.profileComplete;
      }
    }
    const publicProfile = this.props.publicProfile;
    return (
      <div className="profile-preview-page">
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
              <br />

              <b>
                {publicProfile ? (
                  profileComplete ? (
                    <span>
                      <Reports
                        item={this.props.location.state.item}
                        redirectToExplorer={this.redirectToExplorer}
                      />
                      <Like
                        item={this.props.location.state.item}
                        popularity_score={
                          this.props.location.state.item.popularity_score
                        }
                        liked={this.props.location.state.item.liked}
                        socket={this.props.socket}
                      />
                    </span>
                  ) : (
                      <span>
                        Incomplete profile
                      <br />
                      </span>
                    )
                ) : (
                    <span>
                      <i className="fas fa-heart" style={{ color: "red", marginRight: "1rem" }} />
                      {item.popularityScore} <br />
                    </span>
                  )}
                {item.firstname} {item.lastname} -{" "}
                {distance || distance === 0
                  ? distance <= 1
                    ? "<1 km away"
                    : distance + "km away"
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
