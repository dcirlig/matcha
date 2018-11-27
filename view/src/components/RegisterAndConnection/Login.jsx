import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import * as routes from "../../constants/routes";
import { FormErrors } from "../../constants/utils";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import Header from "../Navigation/Navigation";

const INITIAL_STATE = {
  username: "",
  passwd: "",
  redirect: false,
  formErrors: {
    username: "",
    passwd: ""
  },
  usernameValid: false,
  passwdValid: false,
  error: null,
  succes: null,
  isLoggedIn: false
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let passwdValid = this.state.passwdValid;

    switch (fieldName) {
      case "username":
        usernameValid = value.match(/^[a-zA-Z0-9_]+$/);
        fieldValidationErrors.username = usernameValid
          ? ""
          : "Forbidden characters! Your username can only contain letters, numbers or '_'!";
        break;
      case "passwd":
        passwdValid = value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/);
        fieldValidationErrors.passwd = passwdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter and the length >= 4";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        usernameValid: usernameValid,
        passwdValid: passwdValid
      },
      this.validateForm
    );
  }

  response = (err, succes) => {
    var res = null;
    if (err) res = err;
    else res = succes;
    return res;
  };

  validateForm() {
    this.setState({
      formValid: this.state.usernameValid && this.state.passwdValid
    });
  }

  onSubmit = event => {
    axios
      .post(`/api/users/login`, this.state)

      .then(res => {
        if (res.data.success) {
          sessionStorage.setItem("userData", res.data.username);
          this.setState({ redirect: true });
          this.setState({ success: res.data.success });
        } else if (res.data.error) {
          this.setState({ error: res.data.error });
        }
      })
      .catch(err => {});
    this.setState({ ...INITIAL_STATE });
    event.preventDefault();
  };

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  render() {
    const { username, passwd, redirect, error, succes } = this.state;

    if (redirect) {
      return <Redirect to={`/users/${username}`} />;
    }

    if (sessionStorage.getItem("userData")) {
      return <Redirect to={`/users/${sessionStorage.getItem("userData")}`} />;
    }

    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <div className="container col-md-6">
          <form>
            <div
              className={`form-group row
                 ${this.errorClass(this.state.formErrors.username)}`}
            >
              <label htmlFor="userUsername" className="col-sm-2 col-form-label">
                Username
              </label>
              <input
                name="username"
                type="text"
                className="form-control"
                id="userUsername"
                placeholder="Username"
                onChange={e => this.onChange(e)}
                value={username}
              />
            </div>
            <div
              className={`form-group row
                 ${this.errorClass(this.state.formErrors.passwd)}`}
            >
              <label htmlFor="userPassword" className="col-sm-2 col-form-label">
                Password
              </label>
              <input
                name="passwd"
                type="password"
                className="form-control"
                id="userPassword"
                placeholder="Password"
                onChange={e => this.onChange(e)}
                value={passwd}
              />
            </div>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
              <p>{this.response(error, succes)}</p>
            </div>
            <div className="center-block col-md-4">
              <button
                disabled={!this.state.formValid}
                type="submit"
                className="btn btn-primary"
                onClick={this.onSubmit}
              >
                Login
              </button>
            </div>
            <p>
              <Link to={routes.RESET_PASSWORD}>Forgot your password ?</Link>
            </p>
            <p>
              Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
