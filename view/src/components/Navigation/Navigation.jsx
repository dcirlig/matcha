import React from "react";
// import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink
} from "mdbreact";
import matchaLogo from "../../images/matcha_logo.png";
import matchaName from "../../images/matcha_logo_detoure.png";
import * as routes from "../../constants/routes";

class LoginHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      isWideEnough: false,
      isActive: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
      isActive: true
    });
  }
  render() {
    const username = sessionStorage.getItem("userData");
    return (
      <div>
        <Navbar className="navbar-features" dark expand="md" scrolling>
          <NavbarBrand>
            <NavLink to="/explorer" activeClassName="is-active" exact={true}>
              <img
                src={matchaLogo}
                id="logo-matcha-small"
                alt="logo-matcha-small"
                height="30"
              />
              <img
                src={matchaName}
                id="logo-matcha-detoure"
                alt="name-matcha-small"
                height="30"
              />
            </NavLink>
          </NavbarBrand>
          {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
          <Collapse isOpen={this.state.collapse} navbar>
            <NavbarNav left>
              <NavItem>
                <NavLink to={`/users/${username}`} activeClassName="is-active">
                  My Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/explorer" activeClassName="is-active">
                  Explorer
                </NavLink>
              </NavItem>
            </NavbarNav>
            <NavbarNav right>
              <NavItem>
                <NavLink to={routes.LOG_OUT} activeClassName="is-active">
                  Log out
                </NavLink>
              </NavItem>
            </NavbarNav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

class LogoutHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      isWideEnough: false,
      isActive: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
      isActive: true
    });
  }
  render() {
    return (
      <div>
        <Navbar className="navbar-features" dark expand="md" scrolling>
          <NavbarBrand>
            <NavLink to="/" activeClassName="is-active" exact={true}>
              <img
                src={matchaLogo}
                id="logo-matcha-small"
                alt="logo-matcha-small"
                height="30"
              />
              <img
                src={matchaName}
                id="logo-matcha-detoure"
                alt="name-matcha-small"
                height="30"
              />
            </NavLink>
          </NavbarBrand>
          {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
          <Collapse isOpen={this.state.collapse} navbar>
            <NavbarNav right>
              <NavItem>
                <NavLink to={routes.SIGN_UP} activeClassName="is-active">
                  Create Account
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={routes.SIGN_IN} activeClassName="is-active">
                  Sign In
                </NavLink>
              </NavItem>
            </NavbarNav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default function Header(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <LoginHeader />;
  }
  return <LogoutHeader />;
}
