import React, { Component } from "react";
import { MDBAlert } from "mdbreact";
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
  success: null
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
        ) && this.state.email.length <= 50 && this.state.email.length > 8;
        fieldValidationErrors.email = emailValid ? "" : "Invalid Email! Length between 8 and 50.";
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
          this.setState({ success: res.data.success });
        } else if (res.data.error) {
          this.setState({ error: res.data.error });
        }
      })
      .catch(err => { });
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
    const { email, error, success } = this.state;
    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <Link to="/">
          <img id="logo" src={matchaLogo} alt={"logo"} style={{ marginTop: '10vh' }} />
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
              {error && <MDBAlert color="danger" dismiss>{error}</MDBAlert>}
              {success && <MDBAlert color="success" dismiss>{success}</MDBAlert>}
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
