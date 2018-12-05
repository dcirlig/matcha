import React, { Component } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Upload, Icon, Modal } from "antd";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

class UploadPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      previewImage: "",
      userId: "",
      fileList: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // async componentWillMount() {
  //   await this.setState({
  //     userId: sessionStorage.getItem("userId")
  //   });
  // }

  componentDidMount() {
    var data = [];
    this.setState({
      userId: sessionStorage.getItem("userId")
    });
    axios
      .post("/api/displayPhoto", sessionStorage)
      .then(res => {
        var obj = res.data.fileList;
        obj.map(element => {
          var image = {
            uid: element.uid,
            url: `https://localhost:4000/${element.url}`,
            status: "done"
          };
          data.push(image);
          return data;
        });
        this.setState({
          fileList: data
        });
      })
      .catch(err => {});
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  async handleChange(e) {
    var userId = sessionStorage.getItem("userId");
    var file = e.file;
    var status = e.file.status;
    var uid = e.file.uid;
    var fileList = e.fileList;
    if (file.type === "image/jpeg" || file.type === "image/png") {
      await this.setState({
        fileList: fileList
      });
    }
    if (status === "done") {
      const formData = new FormData();
      formData.append("myImage", file.originFileObj);
      formData.set("status", status);
      formData.set("userId", userId);
      formData.set("uid", uid);
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      axios
        .post("/api/uploadPhoto", formData, config)
        .then(response => {
          console.log("response=", response);
        })
        .catch(error => {
          console.log("error=", error);
        });
    } else if (status === "removed") {
      var userData = {
        uid: uid,
        url: file.url
      };
      await this.setState({
        fileList: fileList
      });
      axios
        .post("/api/deletephoto", userData)
        .then(response => {
          console.log("response=", response);
        })
        .catch(error => {
          console.log("error=", error);
        });
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="container">
        <div className="clearfix">
          <Upload
            customRequest={dummyRequest}
            listType="picture-card"
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            fileList={fileList}
            // accept="image/*"
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </div>
      </div>
    );
  }
}

export default UploadPhoto;