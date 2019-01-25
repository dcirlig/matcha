import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
  MDBIcon
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
    this.logOut = this.logOut.bind(this);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
      isActive: true
    });
  }

  logOut() {
    sessionStorage.setItem("userData", "");
    sessionStorage.setItem("latitude", "");
    sessionStorage.setItem("longitude", "");
    sessionStorage.clear();
    window.location.href = "/login";
  }

  render() {
    const username = sessionStorage.getItem("userData");
    const { notSeenNotifications } = this.props;
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
            <NavbarNav right>
              <NavItem>
                <NavLink to={routes.NOTIFICATION} activeClassName="is-active">
                  <div className="numberCircle">{notSeenNotifications}</div>
                  <MDBIcon icon="bell" size="lg" className="iconProfile" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={`/chat/chatpage`} activeClassName="is-active">
                  <MDBIcon icon="envelope" size="lg" className="iconProfile" />
                </NavLink>
              </NavItem>
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
              <NavItem>
                <button className="logOutButton" onClick={this.logOut}>
                  Log out
                </button>
                {/* <NavLink to={routes.LOG_OUT} activeClassName="is-active">
                  Log out
                </NavLink> */}
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
  const notSeenNotifications = props.notSeenNotifications;
  if (isLoggedIn) {
    return <LoginHeader notSeenNotifications={notSeenNotifications} />;
  }
  return <LogoutHeader />;
}
