import React, { Component } from "react";
import axios from "axios";
import { FormErrors } from "../../constants/utils";
import "../../index.css";

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
  succes: null
};

class ResetConfirmPassword extends Component {
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
    let newPasswdValid = this.state.newPasswdValid;
    let confNewPasswdValid = this.state.confNewPasswdValid;

    switch (fieldName) {
      case "newpasswd":
        newPasswdValid = value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/);
        fieldValidationErrors.newpasswd = newPasswdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter and the length >= 4";
        break;
      case "confnewpasswd":
        confNewPasswdValid = value.match(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/
        );
        fieldValidationErrors.confnewpasswd = confNewPasswdValid
          ? ""
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter and the length >= 4";
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

  response = (err, succes) => {
    var res = null;
    if (err) res = err;
    else res = succes;
    return res;
  };

  validateForm() {
    this.setState({
      formValid:
        this.state.newPasswdValid &&
        this.state.confNewPasswdValid &&
        this.state.newpasswd === this.state.confnewpasswd
    });
  }

  onSubmit = event => {
    axios
      .post(
        `/api/users/password/reset/confirm/${this.props.match.params.token}`,
        this.state
      )
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

  render() {
    const { newpasswd, confnewpasswd, error, succes } = this.state;
    return (
      <div className="container">
        <form>
          <div
            className={`form-group row
               ${this.errorClass(this.state.formErrors.newpasswd)}`}
          >
            <label htmlFor="newUserPassword">New Password *</label>
            <input
              name="newpasswd"
              type="password"
              className="form-control"
              id="newUserPassword"
              placeholder="Password"
              onChange={e => this.onChange(e)}
              value={newpasswd}
            />
          </div>
          <div
            className={`form-group row
               ${this.errorClass(this.state.formErrors.confnewpasswd)}`}
          >
            <label htmlFor="confNewUserPassword">Confirm New Password *</label>
            <input
              name="confnewpasswd"
              type="password"
              className="form-control"
              id="confNewUserPassword"
              placeholder="Password"
              onChange={e => this.onChange(e)}
              value={confnewpasswd}
            />
          </div>

          <div className="panel panel-default">
            <FormErrors formErrors={this.state.formErrors} />
            <p>{this.response(error, succes)}</p>
          </div>
          <button
            disabled={!this.state.formValid}
            type="submit"
            className="btn btn-primary"
            onClick={this.onSubmit}
          >
            Register
          </button>
        </form>
      </div>
    );
  }
}

export default ResetConfirmPassword;
