import ReactDOM from "react-dom";
import RegisterPage from "./components/RegisterAndConnection/Register";
import LoginPage from "./components/RegisterAndConnection/Login";
import ConfirmEmailPage from "./components/RegisterAndConnection/Verify";
import ResetPasswordPage from "./components/ResetPassword/ResetPassword";
import ResetConfirmPasswordPage from "./components/ResetPassword/ResetConfirmPassword";
import UserProfilPage from "./components/Profil/UserProfilPage";
import ChatPage from "./components/Chat/ChatPage";
import HomePage from "./components/Navigation/HomePage";
import NotFoundPage from "./components/Navigation/NotFoundPage";
import SearchUsersPage from "./components/Search/SearchUsers";
import NotificationsPage from "./components/Notifications/NotificationsPage";
import * as routes from "./constants/routes";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./styles/styles.scss";
import history from "./constants/history";
import io from "socket.io-client";
import { notification } from "antd";
const socketUrl = "localhost:8081";
const socket = io(socketUrl);

socket.on("NOTIF_RECEIVED", data => {
  const openNotificationWithIcon = type => {
    notification[type]({
      message: data.fromUser + " " + data.message
    });
  };
  openNotificationWithIcon("info");
});

socket.on("connect", function () {
  if (sessionStorage.getItem("userId")) {
    var userId = sessionStorage.getItem("userId");
    socket.emit("notif", userId);
    socket.emit("onlineUser", userId, socket.id);
  }
  socket.on("disconnect", function () { });
});

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
          render={props => <LoginPage {...props} socket={socket} />}
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
          render={props => <UserProfilPage {...props} socket={socket} />}
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
          render={props => <ChatPage {...props} socket={socket} />}
        />
        <Route
          exact
          path={routes.NOTIFICATION}
          render={props => <NotificationsPage {...props} socket={socket} />}
        />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
