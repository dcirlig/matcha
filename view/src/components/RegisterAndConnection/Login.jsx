import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import * as routes from "../../constants/routes";
import { FormErrors } from "../../constants/utils";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import Header from "../Navigation/Navigation";
import matchaLogo from "../../images/matcha_logo_full.png";
import { Input, Button } from "mdbreact";
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
  succes: null,
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

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    console.log("coucou")
    this._isMounted = false;
    console.log(this._isMounted)
  }

  getGeolocation() {
    navigator.geolocation.getCurrentPosition(
      async location => {
        const coords = Object.assign({}, this.state.coords, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        if (this._isMounted === true) {
          this.setState({ coords });
        }
        await sessionStorage.setItem('latitude', location.coords.latitude)
        await sessionStorage.setItem('longitude', location.coords.longitude)
      },
      error => {
        iplocation(this.state.ip)
          .then(async res => {
            const coords = Object.assign({}, this.state.coords, {
              latitude: res.latitude,
              longitude: res.longitude
            });
            if (this._isMounted === true) {
              this.setState({ coords });
            }
            await sessionStorage.setItem('latitude', res.latitude)
            await sessionStorage.setItem('longitude', res.longitude)
          })
          .catch(err => { });
      }
    );

  }

  getIpLocation() {
    publicIp.v4().then(ip => {
      iplocation(ip)
        .then(async res => {
          await sessionStorage.setItem('latitude', res.latitude)
          await sessionStorage.setItem('longitude', res.longitude)
          const coords = Object.assign({}, this.state.coords, {
            latitude: res.latitude,
            longitude: res.longitude
          });
          if (this._isMounted === true) {
            this.setState({ coords });
          }
        })
        .catch(err => { });
    });
  }

  onChange = e => {
    const name = e.target.name
    var value = e.target.value
    const { geoloc } = this.state

    if (name === "checkbox") {
      console.log('coucou')
      if (this._isMounted === true) {
        this.setState({ geoloc: 1 })
      }

      value = e.target.checked
      this.getGeolocation();
    }
    if (geoloc === 0) {
      this.getIpLocation()
    }
    if (this._isMounted === true) {
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    }
    console.log(sessionStorage)
  }


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

  response = (err, succes) => {
    var res = null;
    if (err) res = err;
    else res = succes;
    return res;
  };

  validateForm() {
    console.log('isMounted', this._isMounted)
    if (this._isMounted) {
      this.setState({
        formValid: this.state.usernameValid && this.state.passwdValid
      });
    }
  }

  onSubmit = event => {
    console.log(this.state)
    axios
      .post(`/api/users/login`, this.state)

      .then(res => {
        if (res.data.success) {
          sessionStorage.setItem("userData", res.data.username);
          sessionStorage.setItem("userId", res.data.userId);
          // console.log(res.data.coords)
          // sessionStorage.setItem("latitude", res.data.coords.latitude);
          // sessionStorage.setItem("longitude", res.data.coords.longitude);
          if (this._isMounted) {
            this._isMounted = false
            // await this.setState({ success: res.data.success });
            this.setState({ redirect: true });
          }
          // window.location = 'https://localhost:4000/users/' + res.data.username
        } else if (res.data.error) {
          // this.setState({ error: res.data.error });
        }
      })

      .catch(err => { });
    // this.setState({ ...INITIAL_STATE });
    event.preventDefault();
  };

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  handleClearErrorMessage() {
    if (this._isMounted) {
      this.setState({ error: undefined });
    }
  }

  render() {
    const { username, passwd, error, succes, redirect } = this.state;

    if (redirect) {
      return <Redirect to={`/users/${username}`} />;
    }

    if (sessionStorage.getItem("userData")) {
      return <Redirect to={`/users/${sessionStorage.getItem("userData")}`} />;
    }

    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <Link to="/">
          <img id="logo" src={matchaLogo} alt={"logo"} />
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
            <Input
              label="Authorize geolocation"
              type="checkbox"
              id="checkbox2"
              onChange={e => this.onChange(e)}
              checked={this.state.checkbox}
              name="checkbox"
            />
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
              <p>{this.response(error, succes)}</p>
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
          errorMessage={this.state.error}
          handleClearErrorMessage={this.handleClearErrorMessage}
        />
      </div>
    );
  }
}

export default LoginPage;
