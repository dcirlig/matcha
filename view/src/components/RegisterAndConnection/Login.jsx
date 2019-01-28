import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as routes from "../../constants/routes";
import { FormErrors } from "../../constants/utils";
import axios from "axios";
import "../../index.css";
import Header from "../Navigation/Navigation";
import matchaLogo from "../../images/matcha_logo_full.png";
import { Input, Button, MDBAlert } from "mdbreact";
import LoginModal from "./RegisterModal";
import iplocation from "iplocation";
const publicIp = require("public-ip");

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
  success: null,
  isLoggedIn: false,
  geoloc: 0,
  checkbox: false,
  coords: {
    latitude: "",
    longitude: ""
  }
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = { ...INITIAL_STATE };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClearErrorMessage = this.handleClearErrorMessage.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    await navigator.geolocation.getCurrentPosition(
      async location => {
        const coords = Object.assign({}, this.state.coords, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        if (this._isMounted === true) {
          this.setState({ coords, geoloc: 1 });
        }
        await sessionStorage.setItem("latitude", location.coords.latitude);
        await sessionStorage.setItem("longitude", location.coords.longitude);
      },
      error => {
        publicIp.v4().then(ip => {
          iplocation(ip)
            .then(async res => {
              await sessionStorage.setItem("latitude", res.latitude);
              await sessionStorage.setItem("longitude", res.longitude);
              const coords = Object.assign({}, this.state.coords, {
                latitude: res.latitude,
                longitude: res.longitude
              });
              if (this._isMounted === true) {
                this.setState({ coords, geoloc: 1 });
              }
            })
            .catch(err => { });
        })
          .catch(err => { });
      }
    );
  }

  getIpLocation() {
    publicIp.v4().then(ip => {
      iplocation(ip)
        .then(async res => {
          await sessionStorage.setItem("latitude", res.latitude);
          await sessionStorage.setItem("longitude", res.longitude);
          const coords = Object.assign({}, this.state.coords, {
            latitude: res.latitude,
            longitude: res.longitude
          });
          if (this._isMounted === true) {
            this.setState({ coords, geoloc: 1 });
          }
        })
        .catch(err => { });
    });
  }

  onChange = e => {
    const name = e.target.name;
    var value = e.target.value;
    if (this._isMounted === true) {
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    }
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let passwdValid = this.state.passwdValid;

    switch (fieldName) {
      case "username":
        usernameValid = value.match(/^[a-zA-Z0-9_]+$/) && this.state.username.length <= 20 && this.state.username.length >= 4;
        fieldValidationErrors.username = usernameValid
          ? ""
          : "Forbidden characters! It must contain only letters, numbers or '_'! Length between 4 and 20.";
        break;
      case "passwd":
        passwdValid = !!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/);
        fieldValidationErrors.passwd = passwdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter, 1 special character and the length must be >= 8 and <=20";
        break;
      default:
        break;
    }
    if (this._isMounted) {
      this.setState(
        {
          formErrors: fieldValidationErrors,
          usernameValid: usernameValid,
          passwdValid: passwdValid
        },
        this.validateForm
      );
    }
  }

  validateForm() {
    if (this.state.geoloc !== 1) {
      this.getIpLocation()
    }
    if (this._isMounted) {
      this.setState({
        formValid: this.state.usernameValid && this.state.passwdValid
      });
    }
  }

  onSubmit = event => {
    axios
      .post(`/api/users/login`, this.state)

      .then(async res => {
        if (res.data.success) {
          await sessionStorage.setItem("userData", res.data.username);
          await sessionStorage.setItem("userId", res.data.userId);
          this.props.socket.emit(
            "onlineUser",
            res.data.userId,
            this.props.socket.id
          );
          await this.props.socket.emit("notif", res.data.userId);
          await this.setState({ redirect: true });
        } else if (res.data.error) {
          this.setState({ error: res.data.error });
        }
      })
      .catch(err => { });
    event.preventDefault();
  };

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  handleClearErrorMessage() {
    if (this._isMounted) {
      if (this.state.error) {
        this.setState({ error: undefined });
      } else if (this.state.success) {
        this.setState({ success: undefined });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { username, passwd, error, success, redirect } = this.state;

    if (redirect) {
      return <Redirect to={`/users/${username}`} />;
    }

    if (sessionStorage.getItem("userData")) {
      return <Redirect to={`/users/${sessionStorage.getItem("userData")}`} />;
    }

    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <Link to="/">
          <img id="logoLogin" src={matchaLogo} alt={"logo"} />
        </Link>
        <div className="subscriptionForm grey-text">
          <form>
            <div
              className={`${this.errorClass(this.state.formErrors.username)}`}
            >
              <label className="subscriptionForm__field">
                <Input
                  name="username"
                  type="text"
                  className="subscriptionForm__input"
                  id="userUsername"
                  label="Username"
                  onChange={e => this.onChange(e)}
                  value={username}
                />
              </label>
            </div>
            <div className={`${this.errorClass(this.state.formErrors.passwd)}`}>
              <label className="subscriptionForm__field">
                <Input
                  name="passwd"
                  type="password"
                  className="subscriptionForm__input"
                  id="userPassword"
                  label="Password"
                  onChange={e => this.onChange(e)}
                  value={passwd}
                />
              </label>
            </div>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
              {error && <MDBAlert color="danger" dismiss>{error}</MDBAlert>}
              {success && <MDBAlert color="success" dismiss>{success}</MDBAlert>}
            </div>
            <Button
              disabled={!this.state.formValid}
              type="submit"
              rounded
              gradient="peach"
              className="big-button"
              onClick={this.onSubmit}
            >
              Login
            </Button>
            <p>
              <Link className="linkTo" to={routes.RESET_PASSWORD}>
                Forgot your password ?
              </Link>
            </p>
            <p>
              <b>Don't have an account?</b>{" "}
              <Link className="linkTo" to={routes.SIGN_UP}>
                Sign Up
              </Link>
            </p>
          </form>
        </div>
        <LoginModal
          errorMessage={error ? error : success}
          handleClearErrorMessage={this.handleClearErrorMessage}
        />
      </div>
    );
  }
}

export default LoginPage;
