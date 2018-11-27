import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as routes from "../../constants/routes";
import { Link, Redirect } from "react-router-dom";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class ConfirmEmailPage extends Component {
  state = {
    error: null,
    succes: null,
    divAlert: null
  };

  response = (err, succes) => {
    if (err) {
      return <Redirect to="/register" />;
    } else {
      return succes;
    }
  };

  componentDidMount() {
    axios
      .post(`/api/users/verify/${this.props.match.params.token}`)

      .then(res => {
        if (res.data.success) {
          this.setState(byPropKey("succes", res.data.succes));
          this.setState(byPropKey("divAlert", "alert alert-success"));
        } else if (res.data.error) {
          this.setState({ error: res.data.error });
          this.setState(byPropKey("divAlert", "alert alert-danger"));
        }
      })
      .catch(err => {});
  }

  render() {
    const { error, succes, divAlert } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className={divAlert} role="alert">
            {this.response(error, succes)}
          </div>
          <Link className="nav-link" to={routes.SIGN_IN}>
            <button className="btn btn-primary">Sign In</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default ConfirmEmailPage;
