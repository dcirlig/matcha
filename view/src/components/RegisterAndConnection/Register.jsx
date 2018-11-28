import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import * as routes from "../../constants/routes";
import axios from "axios";
import { FormErrors } from "../../constants/utils";
import "../../index.css";
import Header from "../Navigation/Navigation";
import matchaLogo from '../../images/matcha_logo_full.png';
import { Input, Button } from 'mdbreact';
import RegisterModal from './RegisterModal';

const INITIAL_STATE = {
  firstname: "",
  lastname: "",
  email: "",
  username: "",
  passwd: "",
  gender: "female",
  redirect: false,
  formErrors: {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    passwd: "",
    gender: ""
  },
  firstNameValid: false,
  lastNameValid: false,
  emailValid: false,
  usernameValid: false,
  passwdValid: false,
  error: null,
  success: null,
  isLoggedIn: false
};

class RegisterPage extends Component {
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
    let passwdValid = this.state.passwdValid;

    switch (fieldName) {
      case "firstname":
        firstNameValid = value.match(/^[a-zA-Z]+$/);
        fieldValidationErrors.firstname = firstNameValid
          ? ""
          : "Invalid first name! Your first name must contain only upper and lower case letters!";
        break;
      case "lastname":
        lastNameValid = value.match(/^[a-zA-Z]+$/);
        fieldValidationErrors.lastname = lastNameValid
          ? ""
          : "Invalid last name! Your last name must contain only upper and lower case letters!";
        break;
      case "email":
        emailValid = value.match(
          /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+.([A-Za-z]{2,4})$/
        );
        fieldValidationErrors.email = emailValid ? "" : "Invalid Email!";
        break;
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
          : "Your password must contain at least 1 number, 1 lowercase, 1 upper case letter and the length must be >= 4";
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
        passwdValid: passwdValid
      },
      this.validateForm
    );
  }

  response = (err, success) => {
    var res = null;
    if (err) res = err;
    else res = success;
    return res;
  };

  validateForm() {
    this.setState({
      formValid:
        this.state.firstNameValid &&
        this.state.lastNameValid &&
        this.state.emailValid &&
        this.state.usernameValid &&
        this.state.passwdValid &&
        (this.state.gender === "female" || this.state.gender === "male")
    });
  }

  onSubmit = event => {
    axios
      .post(`/api/users/register`, this.state)
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
    this.setState({ error: undefined })
  }

  render() {
    const {
      firstname,
      lastname,
      email,
      username,
      passwd,
      error,
      success,
      redirect
    } = this.state;

    if (redirect) {
      return <Redirect to={routes.SIGN_IN} />;
    }

    if (sessionStorage.getItem("userData")) {
      return <Redirect to={`/users/${sessionStorage.getItem("userData")}`} />;
    }

    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <Link to="/"><img id="logo" src={matchaLogo} alt={"logo"} /></Link>
        <div className="subscriptionForm grey-text">
          <form>
            <div className={`${this.errorClass(this.state.formErrors.email)}`}>
              <label className="subscriptionForm__field">
                <Input
                  name="email"
                  type="email"
                  className="subscriptionForm__input"
                  id="userEmail"
                  label="Email*"
                  onChange={e => this.onChange(e)}
                  value={email}
                />
              </label>
            </div>
            <div className={`${this.errorClass(this.state.formErrors.username)}`}>
              <label className="subscriptionForm__field">
                <Input
                  name="username"
                  type="text"
                  className="subscriptionForm__input"
                  id="userUsername"
                  label="Username*"
                  onChange={e => this.onChange(e)}
                  value={username}
                />
              </label>
            </div>
            <div className={`${this.errorClass(this.state.formErrors.firstname)}`}>
              <label className="subscriptionForm__field">
                <Input
                  name="firstname"
                  type="text"
                  className="subscriptionForm__input"
                  id="userFirstName"
                  label="First Name*"
                  onChange={e => this.onChange(e)}
                  value={firstname}
                />
              </label>
            </div>
            <div className={`${this.errorClass(this.state.formErrors.lastname)}`}>
              <label className="subscriptionForm__field">
                <Input
                  name="lastname"
                  type="text"
                  className="subscriptionForm__input"
                  id="userLastName"
                  label="Last Name*"
                  onChange={e => this.onChange(e)}
                  value={lastname}
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
                  label="Password*"
                  onChange={e => this.onChange(e)}
                  value={passwd}
                />
              </label>
            </div>
            <div className={`${this.errorClass(this.state.formErrors.gender)}`}>
              <label className="subscriptionForm__field">
                <select
                  name="gender"
                  id="userGender"
                  label="Gender"
                  className="subscriptionForm__input"
                  onChange={e => this.onChange(e)}
                >
                  <option className="subscriptionForm__field">Select gender*</option>
                  <option className="subscriptionForm__field" value="female">Female</option>
                  <option className="subscriptionForm__field" value="male">Male</option>
                </select>
              </label>
            </div>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
              <p>{this.response(error, success)}</p>
            </div>
            <Button
              disabled={!this.state.formValid}
              type="submit"
              className="big-button"
              onClick={this.onSubmit}
              rounded gradient="peach"
            >
              Register
              </Button>
            <p>
              <b>You already have an account?</b> <Link className="linkTo" to={routes.SIGN_IN}>Sign In</Link>
            </p>
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



//       <div>
//         <Header isLoggedIn={this.state.isLoggedIn} />
//         <div className="container">
//           <form className="subscriptionForm grey-text">
//             <div className="form-row">
//               <div
//                 className={`form-group col-md-6
//                  ${this.errorClass(this.state.formErrors.firstname)}`}
//               >
//                 <label htmlFor="userFirstName">First Name *</label>
//                 <Input
//                   name="firstname"
//                   type="text"
//                   className="form-control"
//                   id="userFirstName"
//                   placeholder="First Name"
//                   onChange={e => this.onChange(e)}
//                   value={firstname}
//                 />
//               </div>
//               <div
//                 className={`form-group col-md-6
//                  ${this.errorClass(this.state.formErrors.lastname)}`}
//               >
//                 <label htmlFor="userLastName">Last Name *</label>
//                 <Input
//                   name="lastname"
//                   type="text"
//                   className="form-control"
//                   id="userLastName"
//                   placeholder="Last Name"
//                   onChange={e => this.onChange(e)}
//                   value={lastname}
//                 />
//               </div>
//             </div>
//             <div
//               className={`form-group 
//                  ${this.errorClass(this.state.formErrors.email)}`}
//             >
//               <label htmlFor="userEmail">Email *</label>
//               <Input
//                 name="email"
//                 type="email"
//                 className="form-control"
//                 id="userEmail"
//                 placeholder="Email"
//                 onChange={e => this.onChange(e)}
//                 value={email}
//               />
//             </div>
//             <div className="form-row">
//               <div
//                 className={`form-group col-md-4
//                  ${this.errorClass(this.state.formErrors.username)}`}
//               >
//                 <label htmlFor="userUsername">Username *</label>
//                 <Input
//                   name="username"
//                   type="text"
//                   className="form-control"
//                   id="userUsername"
//                   placeholder="Username"
//                   onChange={e => this.onChange(e)}
//                   value={username}
//                 />
//               </div>
//               <div
//                 className={`form-group col-md-6
//                  ${this.errorClass(this.state.formErrors.passwd)}`}
//               >
//                 <label htmlFor="userPassword">Password *</label>
//                 <Input
//                   name="passwd"
//                   type="password"
//                   className="form-control"
//                   id="userPassword"
//                   placeholder="Password"
//                   onChange={e => this.onChange(e)}
//                   value={passwd}
//                 />
//               </div>
//               <div
//                 className={`form-group col-md-2
//                  ${this.errorClass(this.state.formErrors.gender)}`}
//               >
//                 <label htmlFor="userGender">Gender</label>
//                 <select
//                   name="gender"
//                   id="userGender"
//                   className="form-control"
//                   onChange={e => this.onChange(e)}
//                 >
//                   <option value="female">Female</option>
//                   <option value="male">Male</option>
//                 </select>
//               </div>
//             </div>
//             <div className="panel panel-default">
//               <FormErrors formErrors={this.state.formErrors} />
//               <p>{this.response(error, success)}</p>
//             </div>
//             <button
//               disabled={!this.state.formValid}
//               type="submit"
//               className="btn btn-primary"
//               onClick={this.onSubmit}
//             >
//               Register
//             </button>
//             <p>
//               You already have an account? <Link to={routes.SIGN_IN}>Sign In</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     );
//   }
// }

export default RegisterPage;
