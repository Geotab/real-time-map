import GeotabApi from "mg-api-js";
import React from "react";
import {
  LoginPage
} from "./login";
import ReactDOM from "react-dom";


let realTimeMapInitFunc;

export const geotabStandAlone = {
  addin: {
    set realTimeMap(RTM) {
      const { initialize, focus, blur } = RTM();
      realTimeMapInitFunc = initialize;

      document.body.style.height = "100vh";
      _createLoginInput(_handleLoginClicked);
    }
  },
};

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

function _createAPI() {

  const {
    email,
    password,
    database,
    server
  } = _retrieveInputData();

  const api = GeotabApi(function (authenticateCallback) {
    authenticateCallback(server, database, email, password, err => {
      document.getElementById("RTM-Login-error").style.display = "block";
      console.error("70", err);
    });

  }, {
    // Overrides for default options
    rememberMe: false
  });

  return api;

};

function _checkLoginSuccessful(api) {
  const testCall = {
    typeName: "Device",
    resultsLimit: 1
  };

  api.call("Get",
    testCall,
    () => _handleSuccessfulLogin(api),
    err => console.error("49", err)
  );
};

function _handleSuccessfulLogin(api) {
  document.getElementById("RTM-Login-error").style.display = "none";
  const state = {};
  const callback = () => { };
  console.warn("97", api);
  realTimeMapInitFunc(api, state, callback);
}