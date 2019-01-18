import React, { Component } from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
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
    await this.setState({ username: sessionStorage.getItem("userData") });
    axios
      .post(`/api/notifications`, { userId: sessionStorage.getItem("userId") })
      .then(async res => {
        if (res.data.success) {
          await this.setState({ count: res.data.success });
        } else {
          console.log("error");
        }
      });
  }

  componentDidMount() {
    axios
      .post(`/api/getAllnotifications`, {
        userId: sessionStorage.getItem("userId")
      })
      .then(async res => {
        if (res.data.success) {
          await this.setState({ list_notif: res.data.success });
        } else {
          console.log("error");
        }
      });
    // var socket = this.props.socket;
    // await socket.on("connect", () => {
    //   console.log("connected");
    //   socket.emit("notif", sessionStorage.getItem("userId"));
    //   socket.on("NOTIF_RECEIVED", async data => {
    //     const openNotificationWithIcon = type => {
    //       notification[type]({
    //         message: data.fromUser + " " + data.message
    //       });
    //     };
    //     openNotificationWithIcon("info");
    //     await this.setState({ count: data.count });
    //   });
    // });
    // this._isMounted = true;
    // sessionStorage.getItem("userData");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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
          <MDBRow>
            <Header
              isLoggedIn={this.state.isLoggedIn}
              notSeenNotifications={count}
            />
            <MDBCol size="3" />
            <MDBCol size="8">
              {list_notif.map((item, index) => (
                <div key={index}>
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

                  {/* <a
                      href={`https://localhost:4000/users/${item.username}`}
                      onClick={e => this.sendVisitNotification(item)}
                    >
                      Show more...
                    </a> */}
                </div>
              ))}
            </MDBCol>
            <MDBCol size="3" />
          </MDBRow>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default NotificationsPage;
