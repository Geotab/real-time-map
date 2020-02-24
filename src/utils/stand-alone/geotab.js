import GeotabApi from "mg-api-js";
import React from "react";
import {
  LoginPage
} from "./login";
import ReactDOM from "react-dom";

export const geotabStandAlone = {

  addin: {

    set realTimeMap(RTM) {
      let showError = false;
      const { initialize, focus, blur } = RTM();
      document.body.style.height = "100vh";
      const rootContainer = document.getElementById("real-time-map-container");
      ReactDOM.render(<LoginPage handleFormSubmit={handleFormSubmit} showError={showError} />, rootContainer);

      const api = GeotabApi(authenticateCallback =>
        authenticateCallback(
          'server',
          'database',
          'userName',
          'password',
          err => {
            console.error(err);
            showError = true;
          }
        )
      );

      console.warn('21', api);

      const state = {};
      const callback = () => { };
      initialize(api, state, callback);

    }
  },
};

function handleFormSubmit() {
  const session = {
    userName: getValue("RTM-login-email"),
    password: getValue("RTM-login-password"),
    database: getValue("RTM-login-database"),
    serverName: getValue("RTM-login-server")
  };
  console.log(session);
};

function getValue(id) {
  const elem = document.getElementById(id);
  if (elem) {
    return elem.value;
  }
};