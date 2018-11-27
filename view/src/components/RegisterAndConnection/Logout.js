import React from "react";
import { Redirect } from "react-router-dom";
import * as routes from "../../constants/routes";

export default function LogOut() {
  sessionStorage.setItem("userData", "");
  sessionStorage.clear();
  return <Redirect to={routes.SIGN_IN} />;
}
