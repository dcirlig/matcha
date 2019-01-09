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
    if (this.props.match.params.username !== prevProps.match.params.username) {
      this.setState({ username: this.props.match.params.username });
    }
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        {user.map((item, index) => (
          <div key={index}>
            <Card
              hoverable
              style={{ width: 600, height: 1000 }}
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
                <Slider className="slider-wrapper" style={{ width: "50" }}>
                  {item.images.map((item, index) => (
                    <div
                      key={index}
                      className="slider-content"
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
