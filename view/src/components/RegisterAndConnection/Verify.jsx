import React, { Component } from "react";
import { MDBContainer, MDBAlert, MDBBtn } from 'mdbreact';
import axios from "axios";
import * as routes from "../../constants/routes";
import { Link, Redirect } from "react-router-dom";
import Header from "../Navigation/Navigation";
import { Helmet } from "react-helmet";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class ConfirmEmailPage extends Component {
  state = {
    error: null,
    success: null,
    divAlert: null
  };

  response = (err, success) => {
    if (err) {
      return <Redirect to="/register" />;
    } else {
      return success;
    }
  };

  componentDidMount() {
    axios
      .post(`/api/users/verify/${this.props.match.params.token}`)

      .then(res => {
        if (res.data.success) {
          this.setState(byPropKey("success", res.data.success));
          this.setState(byPropKey("divAlert", "alert alert-success"));
        } else if (res.data.error) {
          this.setState({ error: res.data.error });
          this.setState(byPropKey("divAlert", "alert alert-danger"));
        }
      })
      .catch(err => { });
  }

  render() {
    const { success } = this.state;
    return (
      <div>
        <Header isLoggedIn={false} />
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <MDBContainer style={{ marginTop: '10vh' }}>
          {success ? <div><MDBAlert color="success">
            <p>You have successfully confirmed your email address. Please sign in to start using Matcha!</p>
            <hr />
            <p className="mb-0">If you can't remember your password, you can reset it on the connection page.</p>

          </MDBAlert>            <Link className="nav-link" to={routes.SIGN_IN}>
              <MDBBtn className="big-button" rounded
                gradient="peach">Sign In</MDBBtn>
            </Link></div> : <div><MDBAlert color="danger">
              <p>Something went wrong while confirming your email address. Please try again or sign in if you've already confirmed your email.</p>
              <hr />
              <p className="mb-0">If you can't remember your password, you can reset it on the connection page.</p>
            </MDBAlert><Link className="nav-link" to={routes.SIGN_IN}>
                <MDBBtn className="big-button" rounded
                  gradient="peach">Sign In</MDBBtn>
              </Link></div>}
        </MDBContainer>
      </div>
    );
  }
}

export default ConfirmEmailPage;