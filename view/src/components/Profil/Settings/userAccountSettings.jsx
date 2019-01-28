import React, { Component } from "react";
import axios from "axios";
import { FormErrors } from "../../../constants/utils";
import { Input, Button, MDBAlert } from "mdbreact";
import RegisterModal from "../../RegisterAndConnection/RegisterModal";
import history from "../../../constants/history";

const INITIAL_STATE = {
  userId: "",
  firstname: "",
  lastname: "",
  email: "",
  username: "",
  new_password: "",
  confirm_new_passwd: "",
  formErrors: {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    new_password: "",
    confirm_new_passwd: ""
  },
  firstNameValid: false,
  lastNameValid: false,
  emailValid: false,
  usernameValid: false,
  newPasswdValid: false,
  confNewPasswdValid: false,
  error: null,
  success: null
};

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClearErrorMessage = this.handleClearErrorMessage.bind(this);
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
    let firstNameValid = this.state.firstNameValid;
    let lastNameValid = this.state.lastNameValid;
    let emailValid = this.state.emailValid;
    let usernameValid = this.state.usernameValid;
    let newPasswdValid = this.state.newPasswdValid;
    let confNewPasswdValid = this.state.confNewPasswdValid;

    switch (fieldName) {
      case "firstname":
        firstNameValid =
          value.match(/^[a-zA-Z-]+$/) &&
          this.state.firstname.length <= 20 &&
          this.state.firstname.length >= 4;
        fieldValidationErrors.firstname = firstNameValid
          ? ""
          : "Invalid first name! It must contain only upper and lower case letters! Length between 4 and 20.";
        break;
      case "lastname":
        lastNameValid =
          value.match(/^[a-zA-Z ]+$/) &&
          this.state.lastname.length <= 20 &&
          this.state.lastname.length >= 4;
        fieldValidationErrors.lastname = lastNameValid
          ? ""
          : "Invalid last name! It must contain only upper and lower case letters! Length between 4 and 20";
        break;
      case "email":
        emailValid =
          value.match(
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+.([A-Za-z]{2,4})$/
          ) &&
          this.state.email.length <= 50 &&
          this.state.email.length > 8;
        fieldValidationErrors.email = emailValid
          ? ""
          : "Invalid Email! Length between 8 and 50.";
        break;
      case "username":
        usernameValid =
          value.match(/^[a-zA-Z0-9_]+$/) &&
          this.state.username.length <= 20 &&
          this.state.username.length >= 4;
        fieldValidationErrors.username = usernameValid
          ? ""
          : "Forbidden characters! It must contain only letters, numbers or '_'! Length between 4 and 20.";
        break;
      case "new_password":
        newPasswdValid = value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        );
        fieldValidationErrors.new_password = newPasswdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter, 1 special character and the length must be >= 8 and <=20";
        break;
      case "confirm_new_passwd":
        confNewPasswdValid = value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        );
        fieldValidationErrors.confirm_new_passwd = confNewPasswdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter, 1 special character and the length must be >= 8 and <=20";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        firstNameValid: firstNameValid,
        lastNameValid: lastNameValid,
        emailValid: emailValid,
        usernameValid: usernameValid,
        newPasswdValid: newPasswdValid,
        confNewPasswdValid: confNewPasswdValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.formErrors
    });
  }

  onSubmit = async event => {
    event.preventDefault();
    let username = "";
    if (this.state.usernameValid) {
      username = this.state.username;
    }
    await this.setState({ userId: sessionStorage.getItem("userId") });
    axios
      .post(`/api/settings`, this.state)
      .then(async res => {
        if (res.data.success) {
          this.setState({ success: res.data.success });
          this.props.getInfos();
          if (username) {
            await sessionStorage.setItem("userData", username);
            history.push(`/users/${username}`);
          }
        } else if (res.data.error) {
          this.setState({ error: res.data.error });
        }
      })
      .catch(err => {});
    this.setState({ ...INITIAL_STATE });
  };

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  handleClearErrorMessage() {
    this.setState({ error: undefined });
  }

  render() {
    const {
      firstname,
      lastname,
      email,
      username,
      new_password,
      confirm_new_passwd,
      error,
      success
    } = this.state;

    return (
      <div>
        <div className="updateForm grey-text">
          <form>
            <div className={`${this.errorClass(this.state.formErrors.email)}`}>
              <label className="updateForm__field">
                <Input
                  name="email"
                  type="email"
                  className="updateForm__input"
                  label="Email"
                  onChange={e => this.onChange(e)}
                  value={email}
                />
              </label>
            </div>
            <div
              className={`${this.errorClass(this.state.formErrors.username)}`}
            >
              <label className="updateForm__field">
                <Input
                  name="username"
                  type="text"
                  className="updateForm__input"
                  label="Username"
                  onChange={e => this.onChange(e)}
                  value={username}
                />
              </label>
            </div>
            <div
              className={`${this.errorClass(this.state.formErrors.firstname)}`}
            >
              <label className="updateForm__field">
                <Input
                  name="firstname"
                  type="text"
                  className="updateForm__input"
                  label="First Name"
                  onChange={e => this.onChange(e)}
                  value={firstname}
                />
              </label>
            </div>
            <div
              className={`${this.errorClass(this.state.formErrors.lastname)}`}
            >
              <label className="updateForm__field">
                <Input
                  name="lastname"
                  type="text"
                  className="updateForm__input"
                  label="Last Name"
                  onChange={e => this.onChange(e)}
                  value={lastname}
                />
              </label>
            </div>
            <div
              className={`${this.errorClass(
                this.state.formErrors.new_password
              )}`}
            >
              <label className="updateForm__field">
                <Input
                  name="new_password"
                  type="password"
                  className="updateForm__input"
                  label="New password"
                  onChange={e => this.onChange(e)}
                  value={new_password}
                />
              </label>
            </div>
            <div
              className={`${this.errorClass(
                this.state.formErrors.confirm_new_passwd
              )}`}
            >
              <label className="updateForm__field">
                <Input
                  name="confirm_new_passwd"
                  type="password"
                  className="updateForm__input"
                  label="Confirm your password"
                  onChange={e => this.onChange(e)}
                  value={confirm_new_passwd}
                />
              </label>
            </div>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
              {error && (
                <MDBAlert color="danger" dismiss>
                  {error}
                </MDBAlert>
              )}
              {success && (
                <MDBAlert color="success" dismiss>
                  {success}
                </MDBAlert>
              )}
            </div>
            <Button
              disabled={!this.state.formValid}
              type="submit"
              className="medium-button"
              onClick={this.onSubmit}
              rounded
              gradient="peach"
            >
              Save
            </Button>
          </form>
        </div>
        <RegisterModal
          errorMessage={this.state.error}
          handleClearErrorMessage={this.handleClearErrorMessage}
        />
      </div>
    );
  }
}

export default SettingsPage;
