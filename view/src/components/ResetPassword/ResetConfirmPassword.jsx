import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Input, Button, MDBAlert } from "mdbreact";
import axios from "axios";
import { FormErrors } from "../../constants/utils";
import "../../index.css";
import ResetModal from "../RegisterAndConnection/RegisterModal";
import Header from "../Navigation/Navigation";
import matchaLogo from "../../images/matcha_logo_full.png";

const INITIAL_STATE = {
  newpasswd: "",
  confnewpasswd: "",
  formErrors: {
    newpasswd: "",
    confnewpasswd: ""
  },
  newPasswdValid: false,
  confNewPasswdValid: false,
  error: null,
  success: null
};

class ResetConfirmPassword extends Component {
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
    let newPasswdValid = this.state.newPasswdValid;
    let confNewPasswdValid = this.state.confNewPasswdValid;

    switch (fieldName) {
      case "newpasswd":
        newPasswdValid = !!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/);
        fieldValidationErrors.newpasswd = newPasswdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter, 1 special character and the length must be >= 8 and <=20";
        break;
      case "confnewpasswd":
        confNewPasswdValid = !!value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        );
        fieldValidationErrors.confnewpasswd = confNewPasswdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter, 1 special character and the length must be >= 8 and <=20";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        newPasswdValid: newPasswdValid,
        confNewPasswdValid: confNewPasswdValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.newPasswdValid && this.state.confNewPasswdValid
    });
  }

  onSubmit = event => {
    event.preventDefault();
    axios
      .post(
        `/api/users/password/reset/confirm/${this.props.match.params.token}`,
        this.state
      )
      .then(res => {
        if (res.data.success) {
          this.setState({ success: res.data.success });
        } else if (res.data.error) {
          this.setState({ error: res.data.error });
        }
      })
      .catch(err => { });
    this.setState({ ...INITIAL_STATE });
  };

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  handleClearErrorMessage() {
    if (this.state.error) {
      this.setState({ error: null });
    } else if (this.state.success) {
      this.setState({ success: null });
    }
  }

  render() {
    const { newpasswd, confnewpasswd, error, success } = this.state;
    return (
      <div>
        <Header isLoggedIn={false} />
        <Link to="/">
          <img id="logoLogin" src={matchaLogo} alt={"logo"} />
        </Link>
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <div className="subscriptionForm grey-text">
          <form>
            <div
              className={`
               ${this.errorClass(this.state.formErrors.newpasswd)}`}
            >
              <label
                className="subscriptionForm__field"
                htmlFor="newUserPassword"
              >
                <Input
                  name="newpasswd"
                  type="password"
                  className="subscriptionForm__input"
                  id="newUserPassword"
                  label="New password*"
                  onChange={e => this.onChange(e)}
                  value={newpasswd}
                />
              </label>
            </div>
            <div
              className={`
               ${this.errorClass(this.state.formErrors.confnewpasswd)}`}
            >
              <label
                className="subscriptionForm__field"
                htmlFor="confNewUserPassword"
              >
                <Input
                  name="confnewpasswd"
                  type="password"
                  className="subscriptionForm__input"
                  id="confNewUserPassword"
                  label="Confirm password*"
                  onChange={e => this.onChange(e)}
                  value={confnewpasswd}
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
              Reset
            </Button>
          </form>
        </div>
        <ResetModal
          errorMessage={error}
          handleClearErrorMessage={this.handleClearErrorMessage}
        />
      </div>
    );
  }
}

export default ResetConfirmPassword;
