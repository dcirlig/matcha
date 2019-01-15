import ReactDOM from "react-dom";
import RegisterPage from "./components/RegisterAndConnection/Register";
import LoginPage from "./components/RegisterAndConnection/Login";
import ConfirmEmailPage from "./components/RegisterAndConnection/Verify";
import ResetPasswordPage from "./components/ResetPassword/ResetPassword";
import ResetConfirmPasswordPage from "./components/ResetPassword/ResetConfirmPassword";
import UserProfilPage from "./components/Profil/UserProfilPage";
import ChatPage from "./components/Chat/ChatPage";
import HomePage from "./components/Navigation/HomePage";
// import Footer from "./components/Navigation/Footer";
import NotFoundPage from "./components/Navigation/NotFoundPage";
import SearchUsersPage from "./components/Search/SearchUsers";
import * as routes from "./constants/routes";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import LogOut from "./components/RegisterAndConnection/Logout";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./styles/styles.scss";
import history from "./constants/history";
import Layout from "./components/Test/test";
import io from "socket.io-client";

const socketUrl = "localhost:8081";
const socket = io(socketUrl);

const App = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route
          exact
          path={routes.HOME_PAGE}
          render={props => <HomePage {...props} />}
        />
        <Route
          exact
          path={routes.SIGN_IN}
          render={props => <LoginPage {...props} />}
        />
        <Route
          exact
          path={routes.SIGN_UP}
          render={props => <RegisterPage {...props} />}
        />
        <Route
          exact
          path={routes.CONFIRM_EMAIL}
          render={props => <ConfirmEmailPage {...props} />}
        />
        <Route
          exact
          path={routes.RESET_PASSWORD}
          render={props => <ResetPasswordPage {...props} />}
        />
        <Route
          exact
          path={routes.RESET_CONFIRM_PASSWORD}
          render={props => <ResetConfirmPasswordPage {...props} />}
        />
        <Route
          exact
          path={routes.USER_PROFIL_PAGE}
          render={props => <UserProfilPage {...props} />}
        />
        <Route
          exact
          path={routes.LOG_OUT}
          render={props => <LogOut {...props} />}
        />
        <Route
          exact
          path={routes.NOT_FOUND}
          render={props => <NotFoundPage {...props} />}
        />
        <Route
          exact
          path={routes.EXPLORER_PAGE}
          render={props => <SearchUsersPage {...props} socket={socket} />}
        />
        <Route
          exact
          path={routes.CHAT_PAGE}
          render={props => <ChatPage {...props} />}
        />
        <Route
          exact
          path={routes.TEST}
          render={props => <Layout {...props} socket={socket} />}
        />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
