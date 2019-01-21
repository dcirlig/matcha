import React, { Component } from "react";
import { MDBRow, MDBCol, MDBContainer, MDBIcon, MDBBtn } from "mdbreact";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";
import axios from "axios";
import { notification } from "antd";
import { Redirect } from "react-router-dom";
import "react-chat-elements/dist/main.css";
import { MessageBox } from "react-chat-elements";
import { ChatItem } from "react-chat-elements";

class NotificationsPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      userId: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("userData"),
      count: "",
      list_notif: []
    };
  }

  async componentWillMount() {
    await this.setState({ userId: sessionStorage.getItem("userId"), count: 0 });
    axios
      .post(`/api/updateNotif`, {
        userId: this.state.userId
      })
      .then(async res => {
        if (res.data.success) {
          await this.setState({ count: res.data.count });
        } else {
          console.log("error");
        }
      });
  }

  async componentDidMount() {
    var socket = this.props.socket;
    await socket.on("connect", () => {
      console.log("connected");
      socket.emit("notif", sessionStorage.getItem("userId"));
      socket.on("NOTIF_RECEIVED", async data => {
        const openNotificationWithIcon = type => {
          notification[type]({
            message: data.fromUser + " " + data.message
          });
        };
        axios
          .post(`/api/notifications`, { userId: this.state.userId })
          .then(async res => {
            console.log(res.data);
            if (res.data.success) {
              await this.setState({ count: res.data.count });
            } else {
              console.log("error");
            }
          });
        openNotificationWithIcon("info");
        axios
          .post(`/api/getAllnotifications`, {
            userId: this.state.userId
          })
          .then(async res => {
            if (res.data.success) {
              await this.setState({ list_notif: res.data.list_notif });
            } else {
              console.log("error");
            }
          });
      });
    });
    axios
      .post(`/api/getAllnotifications`, {
        userId: this.state.userId
      })
      .then(async res => {
        if (res.data.success) {
          await this.setState({ list_notif: res.data.list_notif });
        } else {
          console.log("error");
        }
      });

    this._isMounted = true;
    sessionStorage.getItem("userData");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  sendVisitNotification = e => {
    // e.preventDefault();
    console.log(e);
    var socket = this.props.socket;
    const likeroom = e.senderId;
    const receiverId = e.senderId;
    const senderId = this.state.userId;
    const fromUser = sessionStorage.getItem("userData");
    const sendAt = Date.now();
    const message = "have visited your profile";
    socket.emit("NOTIF_SENT", {
      likeroom,
      message,
      fromUser,
      senderId,
      receiverId,
      sendAt
    });
  };

  render() {
    const { count, list_notif } = this.state;
    const userData = sessionStorage.getItem("userData");
    if (!this._isMounted && !userData) {
      return <Redirect to={routes.SIGN_IN} />;
    }
    console.log(list_notif.length);
    return (
      <div>
        {list_notif.length > 0 ? (
          <div>
            <Header
              isLoggedIn={this.state.isLoggedIn}
              notSeenNotifications={count}
            />
            <MDBContainer className="notif-container">
              <MDBRow>
                <MDBCol size="3" />
                <MDBCol size="6">
                  {list_notif.map((item, index) => (
                    <div key={index}>
                      <a
                        href="#"
                        // {`https://localhost:4000/users/${item.username}`}
                        onClick={e => this.sendVisitNotification(item)}
                      >
                        <ChatItem
                          avatar={
                            item.profil_image.includes("amazonaws")
                              ? item.profil_image
                              : `https://localhost:4000/${item.profil_image}`
                          }
                          alt={"avatar" + item.username}
                          title={""}
                          subtitle={item.username + " " + item.content}
                          date={new Date(parseInt(item.time))}
                        //   unread={0}
                        />
                      </a>
                    </div>
                  ))}
                </MDBCol>
                <MDBCol size="3" />
              </MDBRow>
            </MDBContainer>
          </div>
        ) : (
            <div>
              <Header
                isLoggedIn={this.state.isLoggedIn}
                notSeenNotifications={count}
              />
            </div>
          )}
      </div>
    );
  }
}

export default NotificationsPage;
