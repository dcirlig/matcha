import React, { Component } from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
// import axios from "axios";
import { Redirect } from "react-router-dom";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";
import Avatar from "./UserPhoto/avatarPhoto";
import UserProfileSettings from "./Settings/userProfileSettings";
import UserAccountSettings from "./Settings/userAccountSettings";
import ProfilePreview from "./Preview/profilePreview";
import windowSize from "react-window-size";

class UserProfilPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      userData: sessionStorage.getItem("userData"),
      userId: sessionStorage.getItem("userId"),
      userUrl: "",
      profileSettings: true,
      accountSettings: false,
      redirect: "not upgraded"
    };
    this.profileSettings = this.profileSettings.bind(this);
    this.accountSettings = this.accountSettings.bind(this);
  }

  profileSettings() {
    this.setState({ profileSettings: true, accountSettings: false });
  }

  accountSettings() {
    this.setState({ profileSettings: false, accountSettings: true });
  }

  async componentDidMount() {
    this._isMounted = true;
    await sessionStorage.getItem("userData");
    const userData = sessionStorage.getItem("userData");
    if (this._isMounted) {
      if (userData !== this.props.match.params.username) {
        this._isMounted = false;
        await this.setState({ redirect: true });
      } else {
        await this.setState({ redirect: false });
      }
    }

    // axios
    //   .get(`/api/users/${this.props.match.params.username}`)

    //   .then(res => {
    //     if (this._isMounted) {
    //       this.setState({ userData: this.props.match.params.username });
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  componentDidUpdate() {
    console.log(this._isMounted);
    if (this._isMounted) {
      window.scrollTo(0, 0);
      var myDiv = document.getElementById("lateralScroll");
      myDiv.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { profileSettings, accountSettings, redirect } = this.state;
    return (
      <div>
        {redirect === true && (
          <div>
            <Redirect to={routes.NOT_FOUND} />
          </div>
        )}
        {redirect === false && (
          <div>
            <Header isLoggedIn={this.state.isLoggedIn} />
            <div className="container-fluid">
              <MDBRow>
                <MDBCol
                  id="lateralScroll"
                  size="4"
                  style={{ height: this.props.windowHeight - 50 }}
                >
                  <div className="lateral">
                    <div className="avatarBlock">
                      <Avatar />
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
                  <div>{profileSettings && <UserProfileSettings />}</div>
                  <div>{accountSettings && <UserAccountSettings />}</div>
                </MDBCol>
                <MDBCol
                  className="profilePreview"
                  size="8"
                  style={{ height: this.props.windowHeight - 50 }}
                >
                  <ProfilePreview {...this.props} />
                </MDBCol>
              </MDBRow>
            </div>
          </div>
        )}
        {redirect === "not upgraded" && ""}
      </div>
    );
  }
}

export default windowSize(UserProfilPage);
