import React, { Component } from "react";
import Tags from "../Tags/tagsManagement";
import Gallery from "../UserPhoto/uploadPhoto";
import Geolocation from "../Geolocation/Geolocation";
import Preferences from "./../Preferences/Preferences";

class UserProfileSettings extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      redirect: false,
      userData: "",
      userId: ""
    };
  }
  render() {
    return (
      <div className="userProfileSettings">
        <Gallery />
        <Preferences />
        <Tags />
        <Geolocation />
      </div>
    );
  }
}

export default UserProfileSettings;
