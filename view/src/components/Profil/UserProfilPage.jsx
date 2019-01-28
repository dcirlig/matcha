import React, { Component } from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";
import Avatar from "./UserPhoto/avatarPhoto";
import UserProfileSettings from "./Settings/userProfileSettings";
import UserAccountSettings from "./Settings/userAccountSettings";
import ProfilePreview from "./Preview/profilePreview";
import PublicProfilePreview from "./Preview/publicProfilePreview";
import ProfilePreviewModal from "./Preview/profilePreviewModal";
import ErrorModal from "../RegisterAndConnection/RegisterModal";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";

class UserProfilPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      userId: sessionStorage.getItem("userId"),
      userUrl: "",
      profileSettings: true,
      accountSettings: false,
      redirect: "not upgraded",
      profilePreview: false,
      refresh: false,
      count: "",
      error: undefined,
      not_found: false
    };
    this.profileSettings = this.profileSettings.bind(this);
    this.accountSettings = this.accountSettings.bind(this);
    this.closeProfilePreview = this.closeProfilePreview.bind(this);
    this.profilePreview = this.profilePreview.bind(this);
    this.getInfos = this.getInfos.bind(this);
    this.stopRefresh = this.stopRefresh.bind(this);
    this.handleClearErrorMessage = this.handleClearErrorMessage.bind(this);
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
    if (this._isMounted === true) {
      this.setState({ profilePreview: false });
    }
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

  componentWillMount() {
    if (sessionStorage.getItem("userData")) {
      axios
        .get(`/api/users/${this.props.match.params.username}`)
        .then(async res => {
          if (
            res.data.error ||
            (this.props.location.state &&
              !this.props.location.state.completeProfile)
          ) {
            if (res.data.error) {
              await this.setState({ not_found: true });
            } else {
              this.setState({
                error:
                  "Your profile is incomplete. Please fill in everything before accessing the chat, the explorer or your notifications."
              });
            }
          } else {
            this.setState({ error: "", not_found: false });
          }
        });
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    var socket = this.props.socket;
    socket.emit("notif", this.state.userId);
    socket.on("NOTIF_RECEIVED", data => {
      var count = data.count + this.state.count;
      if (this._isMounted) this.setState({ count: count });
    });
    axios
      .post(`/api/notifications`, { userId: this.state.userId })
      .then(res => {
        if (res.data.success) {
          if (this._isMounted) this.setState({ count: res.data.count });
        }
      })
      .catch();
  }

  handleClearErrorMessage() {
    this.setState({ error: undefined });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {
      profileSettings,
      accountSettings,
      refresh,
      count,
      not_found
    } = this.state;
    const userData = sessionStorage.getItem("userData");
    if (!this._isMounted && !sessionStorage.getItem("userData")) {
      return <Redirect to={routes.SIGN_IN} />;
    }
    if (not_found) {
      return <Redirect to={routes.NOT_FOUND} />;
    }
    return (
      <div>
        {this.props.match.params.username === userData ? (
          <div>
            <Header
              isLoggedIn={this.state.isLoggedIn}
              notSeenNotifications={count}
            />
            <Helmet>
              <style>{"body { overflow: hidden }"}</style>
            </Helmet>
            <div className="container-fluid searchPage">
              <MDBRow>
                <MDBCol
                  id="lateralScroll"
                  size="4"
                  className="lateralScrollProfile"
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
                      <UserProfileSettings
                        className="userProfilSettingsBlock"
                        getInfos={this.getInfos}
                      />
                    )}
                  </div>
                  <div>
                    {accountSettings && (
                      <UserAccountSettings
                        className="userAccountSettingsBlock"
                        getInfos={this.getInfos}
                      />
                    )}
                  </div>
                </MDBCol>
                <MDBCol className="profilePreview" size="8">
                  <ProfilePreview
                    {...this.props}
                    refresh={refresh}
                    stopRefresh={this.stopRefresh}
                  />
                </MDBCol>
              </MDBRow>
            </div>
            <ProfilePreviewModal
              profilePreview={this.state.profilePreview}
              closeProfilePreview={this.closeProfilePreview}
              username={userData}
            />
            <ErrorModal
              errorMessage={this.state.error}
              handleClearErrorMessage={this.handleClearErrorMessage}
            />
          </div>
        ) : (
            <div>
              {" "}
              <Header
                isLoggedIn={this.state.isLoggedIn}
                notSeenNotifications={count}
              />
              <Helmet>
                <style>{"body { overflow-x: hidden, overflow-y: auto }"}</style>
              </Helmet>
              <MDBRow className="publicProfilePreview">
                <PublicProfilePreview {...this.props} />
              </MDBRow>
            </div>
          )}
      </div>
    );
  }
}

export default UserProfilPage;
