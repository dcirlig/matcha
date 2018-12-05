import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FormErrors } from "../../constants/utils";
import "../../index.css";
import Header from "../Navigation/Navigation";
import matchaLogo from "../../images/matcha_logo_full.png";
import { Input, Button } from "mdbreact";
import ResetModal from "../RegisterAndConnection/RegisterModal";

const INITIAL_STATE = {
  email: "",
  formErrors: {
    email: ""
  },
  emailValid: false,
  error: null,
  succes: null
};

class ResetPassword extends Component {
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
    let emailValid = this.state.emailValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(
          /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+.([A-Za-z]{2,4})$/
        );
        fieldValidationErrors.email = emailValid ? "" : "Invalid Email!";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid
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
      formValid: this.state.emailValid
    });
  }

  onSubmit = event => {
    axios
      .post(`/api/users/password/reset`, this.state)
      .then(res => {
        if (res.data.success) {
          this.setState({ succes: res.data.succes });
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

  handleClearErrorMessage() {
    this.setState({ error: undefined });
  }

  render() {
    const { email, error, succes } = this.state;
    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <Link to="/">
          <img id="logo" src={matchaLogo} alt={"logo"} />
        </Link>
        <div className="subscriptionForm grey-text">
          <form>
            <div className={`${this.errorClass(this.state.formErrors.email)}`}>
              <label className="subscriptionForm__field">
                <Input
                  name="email"
                  type="email"
                  id="userEmail"
                  label="Email *"
                  onChange={e => this.onChange(e)}
                  value={email}
                />
              </label>
            </div>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
              <p>{this.response(error, succes)}</p>
            </div>
            <Button
              disabled={!this.state.formValid}
              type="submit"
              className="big-button"
              rounded
              gradient="peach"
              onClick={this.onSubmit}
            >
              Send
            </Button>
          </form>
        </div>
        <ResetModal
          errorMessage={this.state.error}
          handleClearErrorMessage={this.handleClearErrorMessage}
        />
      </div>
    );
  }
}

export default ResetPassword;
