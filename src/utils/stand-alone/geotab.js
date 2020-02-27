import GeotabApi from "mg-api-js";
import React from "react";
import {
  LoginPage
} from "./login";
import ReactDOM from "react-dom";

let initRTMFunc;
let isLoginScreenRendered = false;

export const geotabStandAlone = {
  addin: {
    set realTimeMap(RTM) {
      document.body.style.height = "100vh";
      const { initialize, focus, blur } = RTM();
      initRTMFunc = initialize;
      _authenticate();
    }
  },
};

function _authenticate() {

  const {
    email = "",
    password = "",
    database = "",
    server = "my.geotab.com"
  } = _retrieveInputData();

  const api = GeotabApi(authenticateCallback =>
    authenticateCallback(
      server,
      database,
      email,
      password,
      _handleUnsuccessfulLogin
    )
  );

  _checkLoginSuccessful(api)
    .then(api => _handleSuccessfulLogin(api))
    .catch(_handleUnsuccessfulLogin);
}

function _checkLoginSuccessful(api) {

  return new Promise((resolve, reject) => {
    const testCall = {
      typeName: "Device",
      resultsLimit: 1
    };
    api.call("Get", testCall, () => resolve(api), reject);
  });
};

function _handleSuccessfulLogin(api) {
  _hideError();
  initRTMFunc(api, {}, () => { });
}

function _handleUnsuccessfulLogin(err) {
  console.error("61", err);
  if (!isLoginScreenRendered) {
    isLoginScreenRendered = true;
    _createLoginInput();
  } else {
    _showError();
  }
}

function _createLoginInput() {
  ReactDOM.render(
    <LoginPage
      handleFormSubmit={_handleLoginClicked}
    />,
    document.getElementById("real-time-map-container")
  );
};

function _handleLoginClicked(event) {
  event.preventDefault();
  _hideError();
  _authenticate();
};

function _retrieveInputData() {
  return {
    email: _getValue("RTM-login-email"),
    password: _getValue("RTM-login-password"),
    database: _getValue("RTM-login-database"),
    server: _getValue("RTM-login-server")
  };
};

function _getValue(id) {
  const elem = document.getElementById(id);
  if (elem) {
    return elem.value;
  }
};

function _showError() {
  const loginError = document.getElementById("RTM-Login-error");
  if (loginError) {
    loginError.style.display = "block";
  }
}

function _hideError() {
  const loginError = document.getElementById("RTM-Login-error");
  if (loginError) {
    loginError.style.display = "none";
  }
}
