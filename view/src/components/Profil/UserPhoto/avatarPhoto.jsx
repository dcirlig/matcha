import React, { Component } from "react";
import "antd/dist/antd.css";
import axios from "axios";
import { Upload, Icon, message } from "antd";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg";
  if (!isJPG) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJPG && isLt2M;
}

class Avatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      imageUrl: "",
      text: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentWillMount() {
    await this.setState({
      userId: sessionStorage.getItem("userId")
    });
  }

  componentDidMount() {
    axios
      .post("/api/displayAvatarPhoto", sessionStorage)
      .then(async res => {
        if (res.data) {
          var filePath = res.data.file;
          var imageUrl = "";
          if (filePath.includes("unsplash")) {
            imageUrl = filePath;
          } else {
            imageUrl = `https://localhost:4000/${filePath}`;
          }
          if (filePath) {
            await this.setState({
              imageUrl: imageUrl
            });
          }
        }
      })
      .catch(err => { });
  }

  async handleChange(e) {
    var oldImageUrl = this.state.imageUrl;
    var userId = sessionStorage.getItem("userId");
    var file = e.file;
    if (e.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (e.file.status === "done") {
      const formData = new FormData();
      formData.append("myImage", file.originFileObj);
      formData.set("userId", userId);
      formData.set("oldImageUrl", oldImageUrl);
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      axios
        .post("/api/avatarPhoto", formData, config)
        .then(response => {
          if (response.data.imageUrl) {
            var imageUrl = `${window.location.origin}/${
              response.data.imageUrl
              }`;
            this.setState({ imageUrl: imageUrl });
            this.props.getInfos();
          } else {
            message.error(response.data.error);
          }
        })
        .catch();
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <div>
        <Upload
          customRequest={dummyRequest}
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          accept="image/jpg"
        >
          {imageUrl ? (
            <img
              className="avatarPic"
              src={this.state.imageUrl}
              alt="avatar"
            />
          ) : (
              uploadButton
            )}
        </Upload>
      </div>
    );
  }
}

export default Avatar;
