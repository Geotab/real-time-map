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
      const loginButtonPromise = new Promise(resolve =>
        ReactDOM.render(<LoginPage handleFormSubmit={resolve} showError={showError} />, rootContainer)
      );

      loginButtonPromise.then(() => {
        const server = getValue("RTM-login-server");
        const database = getValue("RTM-login-database");
        const username = getValue("RTM-login-email");
        const password = getValue("RTM-login-password");

        return new Promise((resolve, reject) => {

          const api = GeotabApi(authenticateCallback =>
            authenticateCallback(
              server,
              database,
              username,
              password,
              err => {
                console.error(err);
                reject(err);
              }
            )
          );

          // Sample API invocation retrieves a single "Device" object
          api.call('Get', {
            typeName: 'Device',
            resultsLimit: 1
          },

            function (result) {

              if (result) {
                resolve(api);
                console.log(result);
              }
            },

            function (err) {
              reject();
              console.error(err);
            });

        });
      }).then(api => {



        console.warn('Logged in', api);

        const state = {};
        const callback = () => { };
        initialize(api, state, callback);

      }).catch(err => {
        showError = true;

        console.warn('69 Couldnt log in', err);
      });


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