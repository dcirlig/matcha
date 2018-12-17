import React from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Card } from "antd";
import { WithContext as ReactTags } from "react-tag-input";

const { Meta } = Card;

class profilePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      username: "",
      profilImage: "",
      firstname: "",
      lastname: "",
      gender: "",
      age: "",
      bio: "",
      tags: [],
      location: "",
      sexualOrientation: ""
    };
  }

  componentDidMount() {
    // console.log(sessionStorage.getItem("userData"));
    axios
      .get(`/api/users/${this.props.match.params.username}`)

      .then(res => {
        console.log(res.data);
        this.setState({
          username: res.data.username,
          profilImage: res.data.profilImage,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          gender: res.data.gender,
          age: res.data.age,
          bio: res.data.bio,
          tags: res.data.tags,
          location: res.data.location,
          sexualOrientation: res.data.sexualOrientation
        });
        // console.log(this.state);
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
    const {
      profilImage,
      username,
      bio,
      tags,
      firstname,
      lastname,
      age,
      gender,
      sexualOrientation,
      location
    } = this.state;
    const title = "@" + username;
    if (gender === "male") {
      var genderDisplay = "Man";
    } else if (gender === "female") {
      genderDisplay = "Woman";
    }
    return (
      <Card
        hoverable
        style={{ width: 600, height: 1000 }}
        cover={
          <img
            alt="ProfilePic"
            className="profilePic"
            src={`https://localhost:4000/${profilImage}`}
          />
        }
      >
        <br />
        <p>
          <b>
            {firstname} {lastname} - {location} <br />
            {genderDisplay}, {sexualOrientation} <br />
            {age} y.o.
          </b>
        </p>
        <Meta title={title} description={bio} />
        <ReactTags tags={tags} readOnly={true} />
      </Card>
    );
  }
}

export default profilePreview;
