import React, { Component } from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";
import Avatar from "./UserPhoto/avatarPhoto";
import UserProfileSettings from "./Settings/userProfileSettings";
import UserAccountSettings from "./Settings/userAccountSettings";
import ProfilePreview from "./Preview/profilePreview";
import ProfilePreviewModal from "./Preview/profilePreviewModal";
import windowSize from "react-window-size";
import axios from "axios";
import { notification } from "antd";
import { Redirect } from "react-router-dom";

class UserProfilPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      userId: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("userData"),
      userUrl: "",
      profileSettings: true,
      accountSettings: false,
      redirect: "not upgraded",
      profilePreview: false,
      refresh: false,
      count: ""
    };
    this.profileSettings = this.profileSettings.bind(this);
    this.accountSettings = this.accountSettings.bind(this);
    this.closeProfilePreview = this.closeProfilePreview.bind(this);
    this.profilePreview = this.profilePreview.bind(this);
    this.getInfos = this.getInfos.bind(this);
    this.stopRefresh = this.stopRefresh.bind(this);
  }

  async getInfos() {
    await this.setState({ refresh: true });
  }

  async stopRefresh() {
    await this.setState({ refresh: false });
  }

  profilePreview() {
    if (this._isMounted === true) {
      this.setState({ profilePreview: true });
    }
  }

  closeProfilePreview() {
    this.setState({ profilePreview: false });
  }

  profileSettings() {
    if (this._isMounted === true) {
      this.setState({ profileSettings: true, accountSettings: false });
    }
  }

  accountSettings() {
    if (this._isMounted === true) {
      this.setState({ profileSettings: false, accountSettings: true });
    }
  }

  async componentWillMount() {
    await this.setState({ username: sessionStorage.getItem("userData") });
    axios
      .post(`/api/notifications`, { userId: this.state.userId })
      .then(async res => {
        if (res.data) {
          await this.setState({ count: res.data.success });
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
        openNotificationWithIcon("info");
        await this.setState({ count: data.count });
      });
    });
    this._isMounted = true;
    sessionStorage.getItem("userData");
  }

  componentDidUpdate() {
    const userData = sessionStorage.getItem("userData");
    if (this.props.match.params.username === userData) {
      window.scrollTo(0, 0);
      var myDiv = document.getElementById("lateralScroll");
      myDiv.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { profileSettings, accountSettings, refresh, count, username } = this.state;
    const userData = sessionStorage.getItem("userData");
    if (!this._isMounted && !sessionStorage.getItem("userData")) {
      return <Redirect to={routes.SIGN_IN} />;
    }
    return (
      <div>
        {this.props.match.params.username === userData ? (
          <div>
            <Header
              isLoggedIn={this.state.isLoggedIn}
              notSeenNotifications={count}
            />
            <div className="container-fluid searchPage">
              <MDBRow>
                <MDBCol
                  id="lateralScroll"
                  size="4"
                  style={{ height: this.props.windowHeight - 50 }}
                >
                  <div className="lateral">
                    <div className="avatarBlock">
                      <Avatar getInfos={this.getInfos} />
                    </div>
                    <p className="tagIntro young-passion-gradient">
                      Welcome to your dashboard{" "}
                      {sessionStorage.getItem("userData")}!
                    </p>
                  </div>
                  <div className="lateralIcons">
                    <MDBBtn
                      floating
                      size="6x"
                      gradient="peach"
                      className="iconsButton"
                      onClick={this.profileSettings}
                    >
                      <MDBIcon icon="cog" size="6x" className="iconProfile" />
                    </MDBBtn>
                    <MDBBtn
                      floating
                      size="6x"
                      gradient="peach"
                      className="iconsButtonPreview"
                      onClick={this.profilePreview}
                    >
                      <MDBIcon icon="eye" size="6x" className="iconProfile" />
                    </MDBBtn>
                    <MDBBtn
                      floating
                      size="6x"
                      gradient="peach"
                      className="iconsButton"
                      onClick={this.accountSettings}
                    >
                      <MDBIcon
                        icon="pencil"
                        size="6x"
                        className="iconProfile"
                      />
                    </MDBBtn>
                  </div>
                  <div>
                    {profileSettings && (
                      <UserProfileSettings getInfos={this.getInfos} />
                    )}
                  </div>
                  <div>
                    {accountSettings && (
                      <UserAccountSettings getInfos={this.getInfos} />
                    )}
                  </div>
                </MDBCol>
                <MDBCol
                  className="profilePreview"
                  size="8"
                  style={{ height: this.props.windowHeight - 50 }}
                >
                  <ProfilePreview
                    {...this.props}
                    refresh={refresh}
                    stopRefresh={this.stopRefresh}
                  />
                </MDBCol>
              </MDBRow>
            </div>
          </div>
        ) : (
            <div>
              {" "}
              <Header
                isLoggedIn={this.state.isLoggedIn}
                notSeenNotifications={count}
              />
              <MDBRow>
                <MDBCol size="3" />
                <MDBCol
                  className="profilePreview"
                  size="6"
                  style={{ height: this.props.windowHeight - 50 }}
                >
                  <ProfilePreview
                    {...this.props}
                    refresh={refresh}
                    stopRefresh={this.stopRefresh}
                  />
                </MDBCol>
                <MDBCol size="3" />
              </MDBRow>
            </div>
          )}
        <ProfilePreviewModal
          profilePreview={this.state.profilePreview}
          closeProfilePreview={this.closeProfilePreview}
          username={username}
        />
      </div>
    );
  }
}

export default (sessionStorage.getItem("userData")
  ? windowSize(UserProfilPage)
  : UserProfilPage);

// export default windowSize(UserProfilPage);
