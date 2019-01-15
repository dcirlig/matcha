import React from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Card } from "antd";
import { WithContext as ReactTags } from "react-tag-input";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";

const { Meta } = Card;

class profilePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      redirect: false,
      user: []
    };
  }

  componentDidMount() {
    console.log(this.props.match.params.username)
    axios
      .get(`/api/users/${this.props.match.params.username}`)
      .then(async res => {
        if (res.data.success) {
          var data = res.data.success;
          this.setState({ user: data });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.match.params.username)
    if (this.props.match.params.username !== prevProps.match.params.username) {
      this.setState({ username: this.props.match.params.username });
    }
    if (this.props.refresh === true) {
      axios
        .get(`/api/users/${this.state.username}`)
        .then(async res => {
          if (res.data.success) {
            var data = res.data.success;
            await this.setState({ user: data });
            this.props.stopRefresh()
            // console.log(data)
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    const { user } = this.state;

    return (
      <div className="profile-preview-page">
        {user.map((item, index) => (
          <div className="profile-preview-container" key={index}>
            <Card
              hoverable
              cover={
                <img
                  alt="ProfilePic"
                  className="profilePic"
                  src={
                    item.profilImage
                      ? item.profilImage.includes("amazonaws")
                        ? item.profilImage
                        : `https://localhost:4000/${item.profilImage}`
                      : ""
                  }
                />
              }
            >
              <br />
              <p>
                <b>
                  {item.firstname} {item.lastname} - {item.location} <br />
                  {item.gender === "male" ? "Man" : "Woman"},{" "}
                  {item.sexualOrientation} <br />
                  {item.age} y.o.
                </b>
              </p>
              <Meta title={"@" + item.username} description={item.bio} />
              <ReactTags tags={item.tags} readOnly={true} />
              {item.images ? (
                <Slider className="slider-wrapper-profile" style={{ width: "50" }} infinite={true}>
                  {item.images.map((item, index) => (
                    <div
                      key={index}
                      className="slider-content-profile"
                      style={{
                        background: `url('https://localhost:4000/${
                          item.url
                          }') no-repeat center center`
                      }}
                    />
                  ))}
                </Slider>
              ) : (
                  ""
                )}
            </Card>
          </div>
        ))}
      </div>
    );
  }
}

export default profilePreview;
