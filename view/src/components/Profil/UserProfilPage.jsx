import React, { Component } from "react";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";
import { Redirect } from "react-router-dom";
import axios from "axios";

class UserProfilPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      redirect: false,
      userData: ""
    };
  }

  componentDidMount() {
    axios
      .get(`/api/users/${this.props.match.params.username}`)

      .then(res => {
        this.setState({ userData: res.data.userData });
      })
      .catch(err => {});
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={routes.SIGN_IN} />;
    }

    if (
      this.props.match.params.username !== sessionStorage.getItem("userData")
    ) {
      // return <Redirect to={`/notFound`} />;
    }

    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
      </div>
    );
  }
}

export default UserProfilPage;
