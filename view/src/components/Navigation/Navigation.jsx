import React from "react";
import { Link } from "react-router-dom";
import * as routes from "../../constants/routes";

function LoginHeader() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarText1">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <Link className="nav-link" to={routes.LOG_OUT}>
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

function LogoutHeader() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <Link className="nav-link" to={routes.SIGN_IN}>
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={routes.SIGN_UP}>
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default function Header(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <LoginHeader />;
  }
  return <LogoutHeader />;
}
