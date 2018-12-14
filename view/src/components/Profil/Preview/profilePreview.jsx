import React from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Card } from "antd";
import UploadPhotos from "./../UserPhoto/uploadPhoto";

const { Meta } = Card;

class profilePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("userData"),
      imageUrl: "",
      fileList: []
    };
  }

  componentDidMount() {
    axios
      .post("/api/displayAvatarPhoto", sessionStorage)
      .then(async res => {
        if (res.data) {
          var filePtah = res.data.file;
          if (filePtah) {
            await this.setState({
              imageUrl: `https://localhost:4000/${filePtah}`
            });
          }
        }
      })
      .catch(err => {});
  }

  render() {
    return (
      <Card
        hoverable
        style={{ width: 600, height: 1000 }}
        cover={
          <img
            alt="ProfilePic"
            className="profilePic"
            src={this.state.imageUrl}
          />
        }
      >
        <UploadPhotos />
        <br />
        <Meta title={this.state.username} description="www.instagram.com" />
        opekfiqjir
      </Card>
    );
  }
}

export default profilePreview;
