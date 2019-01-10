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
      userId: "",
      tagsDB: [],
      suggestions: []

    };
    this.update = this.update.bind(this)
  }

  update() {
    this.props.getInfos()
  }

  render() {
    return (
      <div className="userProfileSettings">
        <Gallery
          getImages={this.update}
        />
        <Preferences
          getNewPreferences={this.update}
        />
        <Tags
          getNewTags={this.update}
        />
        <Geolocation
          getNewLocation={this.update}
        />
      </div>
    );
  }
}

export default UserProfileSettings;
