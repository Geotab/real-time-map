import GeotabApi from "mg-api-js";
import React from "react";
import {
  LoginPage
} from "./login";
import ReactDOM from "react-dom";

let isLoginScreenRendered = false;

export const geotabStandAlone = {
  addin: {
    set realTimeMap(RTM) {
      document.body.style.height = "100vh";
      const { initialize, focus, blur } = RTM();
      _initStandAlone(initialize);
    }
  },
};

function _initStandAlone(initRTM) {
  const api = GeotabApi(_authenticate);

  _checkLoginSuccessful(api)
    .then(_handleSuccessfulLogin)
    .catch(_handleUnsuccessfulLogin);
}


function _authenticate(authenticateCallback) {
  // init login code in here
  //       _createLoginInput(_handleLoginClicked);
  authenticateCallback(server, database, email, password, err => {
    _showError();
    console.error("65", err);
  });
}


function _checkLoginSuccessful(api) {

  return new Promise((resolve, reject) => {
    const testCall = {
      typeName: "Device",
      resultsLimit: 1
    };
    api.call("Get", testCall, resolve, reject);
  });
};

function _handleSuccessfulLogin(res) {
  console.warn('51 nice!', res);
}

function _handleUnsuccessfulLogin(err) {
  console.warn('61', err);

  if (!isLoginScreenRendered) {
    isLoginScreenRendered = true;
    _createLoginInput();
  }
}


function _createLoginInput(handleFormSubmit) {
  ReactDOM.render(
    <LoginPage
      handleFormSubmit={handleFormSubmit}
    />,
    document.getElementById("real-time-map-container")
  );
};

function _handleLoginClicked(event) {
  event.preventDefault();
  const api = _createAPI();
  _checkLoginSuccessful(api);
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

// function _createAPI() {

//   const {
//     email,
//     password,
//     database,
//     server
//   } = _retrieveInputData();

//   const api = GeotabApi(function (authenticateCallback) {
//     authenticateCallback(server, database, email, password, err => {
//       _showError();
//       console.error("65", err);
//     });
//   });

//   return api;
// };



// function _handleSuccessfulLogin(api) {
//   _hideError();

//   const state = {};
//   const callback = () => { };
//   realTimeMapInitFunc(api, state, callback);
// }

function _showError() {
  document.getElementById("RTM-Login-error").style.display = "block";
}

function _hideError() {
  document.getElementById("RTM-Login-error").style.display = "none";
}
