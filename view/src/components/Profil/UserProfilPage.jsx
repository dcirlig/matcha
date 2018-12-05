import React, { Component } from "react";
import { MDBRow, MDBCol } from "mdbreact";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";
import Tags from "./Tags/tagsManagement";
import Avatar from "./UserPhoto/avatarPhoto";
import Gallery from "./UserPhoto/uploadPhoto";
// import Geolocation from "./Geolocation/Geolocation";

class UserProfilPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      redirect: false,
      userData: ""
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`/api/users/${this.props.match.params.username}`)

      .then(res => {
        console.log(res);
        if (this._isMounted) {
          this.setState({ userData: this.props.match.params.username });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={routes.SIGN_IN} />;
    } else if (
      this.state.userData &&
      this.state.userData !== sessionStorage.getItem("userData")
    ) {
      return <Redirect to={routes.NOT_FOUND} />;
    }
    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <div className="container-fluid">
          <MDBRow>
            <MDBCol size="4">
              <div className="lateral">
                <Avatar />
                <p>{sessionStorage.getItem("userData")}</p>
              </div>
              <Gallery />
              {this.state.isLoggedIn && <Tags />}
            </MDBCol>
            <MDBCol size="8">Overview profile</MDBCol>
          </MDBRow>
        </div>
      </div>
    );
  }
}

export default UserProfilPage;
