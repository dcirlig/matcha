import React, { Component } from "react";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";
import { Redirect } from "react-router-dom";
import axios from "axios";

class UserProfilPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      redirect: false,
      userData: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`/api/users/${this.props.match.params.username}`)

      .then(res => {
        if (this._isMounted) {
          console.log(res.data.userData)
          this.setState({ userData: res.data.userData });
          console.log(this.state.userData.username)
          console.log(sessionStorage.getItem("userData"))
        }
      })
      .catch(err => { });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={routes.SIGN_IN} />;
    }

    else if (
      this.state.userData === undefined) {
      return <Redirect to={routes.NOT_FOUND} />;
    }

    return (
      <div>

        <Header isLoggedIn={this.state.isLoggedIn} />
      </div>
    );
  }
}

export default UserProfilPage;
